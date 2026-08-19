"use server";

import { db } from "@/db/client";
import { profile, siteSettings, contentBlocks, contactMessages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "@/lib/utils/id";
import { profileSchema, siteSettingsSchema, contactMessageSchema } from "@/lib/validation/schemas";
import { requireAdmin, revalidatePublicSite, type ActionResult } from "@/lib/actions/admin/helpers";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export type ContactFormState = {
  ok: boolean;
  error?: string;
};

// --- PROFILE FUNCTIONS -------------------------------------------------
export async function updateProfile(input: unknown): Promise<ActionResult> {
  const user = await requireAdmin();
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const { typingPhrases, values, ...rest } = parsed.data;
  await db
    .update(profile)
    .set({
      ...rest,
      typingPhrases: JSON.stringify(typingPhrases),
      values: JSON.stringify(values),
      updatedAt: new Date(),  // ✅ تم التعديل
    })
    .where(eq(profile.id, "profile"));

  await logActivity({ userId: user.id, action: "profile.updated" });
  revalidatePath("/admin/content");
  revalidatePublicSite();
  return { ok: true };
}

export async function updateProfileImages(input: {
  avatarUrl?: string;
  resumeUrl?: string;
}): Promise<ActionResult> {
  await requireAdmin();
  await db
    .update(profile)
    .set({ ...input, updatedAt: new Date() })  // ✅ تم التعديل
    .where(eq(profile.id, "profile"));
  revalidatePublicSite();
  return { ok: true };
}

// --- SITE SETTINGS FUNCTIONS -------------------------------------------
export async function updateSiteSettings(input: unknown): Promise<ActionResult> {
  const user = await requireAdmin();
  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  await db
    .update(siteSettings)
    .set({ ...parsed.data, updatedAt: new Date() })  // ✅ تم التعديل
    .where(eq(siteSettings.id, "settings"));

  await logActivity({ userId: user.id, action: "settings.updated" });
  revalidatePath("/admin/settings");
  revalidatePublicSite();
  return { ok: true };
}

export async function updateSiteAssets(input: {
  faviconUrl?: string;
  ogImageUrl?: string;
}): Promise<ActionResult> {
  await requireAdmin();
  await db
    .update(siteSettings)
    .set({ ...input, updatedAt: new Date() })  // ✅ تم التعديل
    .where(eq(siteSettings.id, "settings"));
  revalidatePublicSite();
  return { ok: true };
}

// --- CONTENT BLOCK FUNCTIONS -------------------------------------------
export async function updateContentBlock(
  section: string,
  key: string,
  locale: "en" | "ar",
  value: string
): Promise<ActionResult> {
  const user = await requireAdmin();

  const [existing] = await db
    .select()
    .from(contentBlocks)
    .where(
      and(
        eq(contentBlocks.section, section),
        eq(contentBlocks.key, key),
        eq(contentBlocks.locale, locale)
      )
    )
    .limit(1);

  if (existing) {
    await db
      .update(contentBlocks)
      .set({ value, updatedAt: new Date() })  // ✅ تم التعديل
      .where(eq(contentBlocks.id, existing.id));
  } else {
    await db.insert(contentBlocks).values({ id: nanoid(), section, key, locale, value });
  }

  await logActivity({ userId: user.id, action: "content.updated", entityType: "content_block", entityId: `${section}.${key}.${locale}` });
  revalidatePath("/admin/content");
  revalidatePublicSite();
  return { ok: true };
}

// --- PUBLISH SITE ------------------------------------------------------
export async function publishSite(): Promise<ActionResult> {
  const user = await requireAdmin();
  const [current] = await db.select().from(siteSettings).limit(1);
  const [major, minor] = (current?.publishedVersion ?? "1.0").split(".").map(Number);
  const nextVersion = `${major}.${minor + 1}`;

  await db
    .update(siteSettings)
    .set({
      publishedVersion: nextVersion,
      lastPublishedAt: new Date(),  // ✅ تم التعديل
      updatedAt: new Date(),        // ✅ تم التعديل
    })
    .where(eq(siteSettings.id, "settings"));

  await logActivity({ userId: user.id, action: "site.published", details: nextVersion });
  revalidatePublicSite();
  return { ok: true };
}

// --- CONTACT FORM ------------------------------------------------------
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
    company: formData.get("company")?.toString() ?? "",
  };

  const parsed = contactMessageSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  if (raw.company) {
    return { ok: true };
  }

  const hdrs = await headers();
  const ip = hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

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