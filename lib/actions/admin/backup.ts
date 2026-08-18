"use server";

import { db } from "@/db/client";
import {
  profile,
  siteSettings,
  contentBlocks,
  navigationItems,
  sections,
  socialLinks,
  skills,
  experiences,
  education,
  projects,
  projectImages,
  certificates,
  awards,
  testimonials,
  galleryImages,
  statistics,
} from "@/db/schema";
import { requireAdmin, revalidatePublicSite, type ActionResult } from "./helpers";
import { logActivity } from "@/lib/activity";

const BACKUP_VERSION = 1;

export async function exportBackup(): Promise<ActionResult<{ json: string }>> {
  await requireAdmin();

  const [
    profileRows,
    settingsRows,
    contentRows,
    navRows,
    sectionRows,
    socialRows,
    skillRows,
    expRows,
    eduRows,
    projectRows,
    imageRows,
    certRows,
    awardRows,
    testimonialRows,
    galleryRows,
    statRows,
  ] = await Promise.all([
    db.select().from(profile),
    db.select().from(siteSettings),
    db.select().from(contentBlocks),
    db.select().from(navigationItems),
    db.select().from(sections),
    db.select().from(socialLinks),
    db.select().from(skills),
    db.select().from(experiences),
    db.select().from(education),
    db.select().from(projects),
    db.select().from(projectImages),
    db.select().from(certificates),
    db.select().from(awards),
    db.select().from(testimonials),
    db.select().from(galleryImages),
    db.select().from(statistics),
  ]);

  const backup = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      profile: profileRows,
      siteSettings: settingsRows,
      contentBlocks: contentRows,
      navigationItems: navRows,
      sections: sectionRows,
      socialLinks: socialRows,
      skills: skillRows,
      experiences: expRows,
      education: eduRows,
      projects: projectRows,
      projectImages: imageRows,
      certificates: certRows,
      awards: awardRows,
      testimonials: testimonialRows,
      galleryImages: galleryRows,
      statistics: statRows,
    },
  };

  return { ok: true, data: { json: JSON.stringify(backup, null, 2) } };
}

// NOTE: Import is intentionally scoped to the tables that are safe to
// wholesale-replace (content, not auth/users/sessions/messages) so a bad
// import can't lock the admin out or wipe visitor messages.
export async function importBackup(jsonText: string): Promise<ActionResult> {
  const user = await requireAdmin();

  let parsed: { version: number; data: Record<string, unknown[]> };
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    return { ok: false, error: "That file isn't valid JSON." };
  }

  if (!parsed?.data) {
    return { ok: false, error: "This doesn't look like a portfolio backup file." };
  }

  const tableMap: Record<string, typeof profile> = {
    skills: skills as never,
    experiences: experiences as never,
    education: education as never,
    projects: projects as never,
    certificates: certificates as never,
    awards: awards as never,
    testimonials: testimonials as never,
    galleryImages: galleryImages as never,
    statistics: statistics as never,
    navigationItems: navigationItems as never,
    socialLinks: socialLinks as never,
    contentBlocks: contentBlocks as never,
  };

  try {
    for (const [key, table] of Object.entries(tableMap)) {
      const rows = parsed.data[key];
      if (!Array.isArray(rows) || rows.length === 0) continue;
      await db.delete(table);
      for (const row of rows) {
        await db.insert(table).values(row as never);
      }
    }

    if (Array.isArray(parsed.data.profile) && parsed.data.profile[0]) {
      const { id, ...rest } = parsed.data.profile[0] as Record<string, unknown>;
      void id;
      await db.update(profile).set(rest as never);
    }
    if (Array.isArray(parsed.data.siteSettings) && parsed.data.siteSettings[0]) {
      const { id, ...rest } = parsed.data.siteSettings[0] as Record<string, unknown>;
      void id;
      await db.update(siteSettings).set(rest as never);
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? `Import failed: ${err.message}` : "Import failed.",
    };
  }

  await logActivity({ userId: user.id, action: "backup.imported" });
  revalidatePublicSite();
  return { ok: true };
}
