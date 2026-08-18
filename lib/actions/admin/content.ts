"use server";

import { db } from "@/db/client";
import { profile, siteSettings, contentBlocks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "@/lib/utils/id";
import { profileSchema, siteSettingsSchema } from "@/lib/validation/schemas";
import { requireAdmin, revalidatePublicSite, type ActionResult } from "./helpers";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

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
      updatedAt: new Date().toISOString(),
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
    .set({ ...input, updatedAt: new Date().toISOString() })
    .where(eq(profile.id, "profile"));
  revalidatePublicSite();
  return { ok: true };
}

export async function updateSiteSettings(input: unknown): Promise<ActionResult> {
  const user = await requireAdmin();
  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  await db
    .update(siteSettings)
    .set({ ...parsed.data, updatedAt: new Date().toISOString() })
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
    .set({ ...input, updatedAt: new Date().toISOString() })
    .where(eq(siteSettings.id, "settings"));
  revalidatePublicSite();
  return { ok: true };
}

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
      .set({ value, updatedAt: new Date().toISOString() })
      .where(eq(contentBlocks.id, existing.id));
  } else {
    await db.insert(contentBlocks).values({ id: nanoid(), section, key, locale, value });
  }

  await logActivity({ userId: user.id, action: "content.updated", entityType: "content_block", entityId: `${section}.${key}.${locale}` });
  revalidatePath("/admin/content");
  revalidatePublicSite();
  return { ok: true };
}

export async function publishSite(): Promise<ActionResult> {
  const user = await requireAdmin();
  const [current] = await db.select().from(siteSettings).limit(1);
  const [major, minor] = (current?.publishedVersion ?? "1.0").split(".").map(Number);
  const nextVersion = `${major}.${minor + 1}`;

  await db
    .update(siteSettings)
    .set({
      publishedVersion: nextVersion,
      lastPublishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(siteSettings.id, "settings"));

  await logActivity({ userId: user.id, action: "site.published", details: nextVersion });
  revalidatePublicSite();
  return { ok: true };
}
