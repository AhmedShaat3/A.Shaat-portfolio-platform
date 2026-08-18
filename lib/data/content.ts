import "server-only";
import { db } from "@/db/client";
import { contentBlocks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import type { Locale } from "@/lib/i18n/config";

export type ContentMap = Record<string, string>;

/** Fetch every published content block for a section/locale as a flat { key: value } map. */
export async function getSectionContent(
  section: string,
  locale: Locale
): Promise<ContentMap> {
  const rows = await db
    .select()
    .from(contentBlocks)
    .where(
      and(eq(contentBlocks.section, section), eq(contentBlocks.locale, locale))
    );

  const map: ContentMap = {};
  for (const row of rows) {
    map[row.key] = row.value;
  }
  return map;
}

/** Fetch all content blocks across every section for a given locale (admin editor use). */
export async function getAllContent(locale: Locale) {
  return db
    .select()
    .from(contentBlocks)
    .where(eq(contentBlocks.locale, locale));
}

export async function getAllContentAllLocales() {
  return db.select().from(contentBlocks);
}
