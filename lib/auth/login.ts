import "server-only";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "./password";
import { createSession } from "./session";
import { logActivity } from "@/lib/activity";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export type LoginResult =
  | { ok: true }
  | { ok: false; error: string };

export async function loginWithPassword(
  email: string,
  password: string
): Promise<LoginResult> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  // Constant-ish response to avoid leaking whether the email exists.
  if (!user) {
    return { ok: false, error: "Invalid email or password." };
  }

  if (user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
    const minutes = Math.ceil(
      (new Date(user.lockedUntil).getTime() - Date.now()) / 60000
    );
    return {
      ok: false,
      error: `Too many failed attempts. Try again in ${minutes} minute(s).`,
    };
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    const attempts = user.failedLoginAttempts + 1;
    const locked = attempts >= MAX_ATTEMPTS;
    await db
      .update(users)
      .set({
        failedLoginAttempts: locked ? 0 : attempts,
        lockedUntil: locked
          ? new Date(Date.now() + LOCKOUT_MS).toISOString()
          : null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.id, user.id));
    return { ok: false, error: "Invalid email or password." };
  }

  await db
    .update(users)
    .set({
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(users.id, user.id));

  await createSession(user.id);
  await logActivity({
    userId: user.id,
    action: "auth.login",
    entityType: "user",
    entityId: user.id,
  });

  return { ok: true };
}
