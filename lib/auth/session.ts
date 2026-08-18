import "server-only";
import { cookies, headers } from "next/headers";
import { randomBytes, createHash } from "node:crypto";
import { db } from "@/db/client";
import { sessions, users } from "@/db/schema";
import { eq } from "drizzle-orm";

const SESSION_COOKIE = "portfolio_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string) {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  const hdrs = await headers();

  await db.insert(sessions).values({
    id: tokenHash,
    userId,
    expiresAt,
    userAgent: hdrs.get("user-agent") ?? undefined,
    ipAddress:
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (raw) {
    await db.delete(sessions).where(eq(sessions.id, hashToken(raw)));
  }
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const tokenHash = hashToken(raw);
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, tokenHash))
    .limit(1);

  if (!session) return null;
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, tokenHash));
    return null;
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  if (!user) return null;

  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
