"use server";

import { db } from "@/db/client";
import { users, sessions } from "@/db/schema";
import { eq, ne, and } from "drizzle-orm";
import { verifyPassword, hashPassword, isPasswordStrong } from "@/lib/auth/password";
import { requireAdmin, type ActionResult } from "./helpers";
import { logActivity } from "@/lib/activity";
import { getCurrentUser } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { createHash } from "node:crypto";

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<ActionResult> {
  const admin = await requireAdmin();
  const [user] = await db.select().from(users).where(eq(users.id, admin.id)).limit(1);
  if (!user) return { ok: false, error: "User not found." };

  const valid = await verifyPassword(currentPassword, user.passwordHash);
  if (!valid) return { ok: false, error: "Current password is incorrect." };

  const strength = isPasswordStrong(newPassword);
  if (!strength.valid) return { ok: false, error: strength.message! };

  const passwordHash = await hashPassword(newPassword);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date().toISOString() })
    .where(eq(users.id, admin.id));

  // Invalidate every other session for this user (keep the current one).
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("portfolio_admin_session")?.value;
  const currentHash = rawToken
    ? createHash("sha256").update(rawToken).digest("hex")
    : "";
  if (currentHash) {
    await db
      .delete(sessions)
      .where(and(eq(sessions.userId, admin.id), ne(sessions.id, currentHash)));
  }

  await logActivity({ userId: admin.id, action: "auth.password_changed" });
  return { ok: true };
}

export async function getActiveSessionCount(): Promise<number> {
  const user = await getCurrentUser();
  if (!user) return 0;
  const rows = await db.select().from(sessions).where(eq(sessions.userId, user.id));
  return rows.length;
}
