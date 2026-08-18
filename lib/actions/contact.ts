"use server";

import { db } from "@/db/client";
import { contactMessages } from "@/db/schema";
import { contactMessageSchema } from "@/lib/validation/schemas";
import { nanoid } from "@/lib/utils/id";
import { headers } from "next/headers";

export type ContactFormState = {
  ok: boolean;
  error?: string;
};

// Very small in-memory rate limiter: max 5 submissions / 10 min / IP.
// Resets on server restart — fine for a single-instance deployment. For a
// multi-instance production deployment, back this with Redis or similar.
const submissionLog = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissionLog.get(ip) ?? []).filter(
    (t) => now - t < WINDOW_MS
  );
  timestamps.push(now);
  submissionLog.set(ip, timestamps);
  return timestamps.length > MAX_SUBMISSIONS;
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    subject: formData.get("subject")?.toString() ?? "",
    message: formData.get("message")?.toString() ?? "",
    company: formData.get("company")?.toString() ?? "", // honeypot
  };

  const parsed = contactMessageSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  // Honeypot tripped — silently succeed so bots don't learn anything, but
  // never write the message.
  if (raw.company) {
    return { ok: true };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return { ok: false, error: "Too many messages sent. Please try again later." };
  }

  await db.insert(contactMessages).values({
    id: nanoid(),
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject || null,
    message: parsed.data.message,
    ipAddress: ip,
  });

  return { ok: true };
}
