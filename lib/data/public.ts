import "server-only";
import { db } from "@/db/client";
import {
  profile,
  siteSettings,
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
import { eq, desc, asc, and } from "drizzle-orm";

export async function getProfile() {
  const [row] = await db.select().from(profile).limit(1);
  return row ?? null;
}

export async function getSiteSettings() {
  const [row] = await db.select().from(siteSettings).limit(1);
  return row ?? null;
}

export async function getVisibleNavigation() {
  return db
    .select()
    .from(navigationItems)
    .where(eq(navigationItems.visible, true))
    .orderBy(asc(navigationItems.order));
}

export async function getAllNavigation() {
  return db.select().from(navigationItems).orderBy(asc(navigationItems.order));
}

export async function getVisibleSections() {
  return db
    .select()
    .from(sections)
    .where(eq(sections.visible, true))
    .orderBy(asc(sections.order));
}

export async function getAllSections() {
  return db.select().from(sections).orderBy(asc(sections.order));
}

export async function getVisibleSocialLinks() {
  return db
    .select()
    .from(socialLinks)
    .where(eq(socialLinks.visible, true))
    .orderBy(asc(socialLinks.order));
}

export async function getVisibleSkills() {
  return db
    .select()
    .from(skills)
    .where(eq(skills.visible, true))
    .orderBy(asc(skills.order));
}

export async function getVisibleExperiences() {
  return db
    .select()
    .from(experiences)
    .where(eq(experiences.visible, true))
    .orderBy(asc(experiences.order));
}

export async function getVisibleEducation() {
  return db
    .select()
    .from(education)
    .where(eq(education.visible, true))
    .orderBy(asc(education.order));
}

export async function getPublishedProjects() {
  return db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.order));
}

export async function getFeaturedProjects() {
  return db
    .select()
    .from(projects)
    .where(and(eq(projects.published, true), eq(projects.featured, true)))
    .orderBy(asc(projects.order));
}

export async function getProjectBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.published, true)))
    .limit(1);
  if (!row) return null;
  const images = await db
    .select()
    .from(projectImages)
    .where(eq(projectImages.projectId, row.id))
    .orderBy(asc(projectImages.order));
  return { ...row, images };
}

export async function getPublishedCertificates() {
  return db
    .select()
    .from(certificates)
    .where(eq(certificates.published, true))
    .orderBy(asc(certificates.order));
}

export async function getCertificateBySlug(slug: string) {
  const [row] = await db
    .select()
    .from(certificates)
    .where(and(eq(certificates.slug, slug), eq(certificates.published, true)))
    .limit(1);
  return row ?? null;
}

export async function getVisibleAwards() {
  return db.select().from(awards).where(eq(awards.visible, true)).orderBy(asc(awards.order));
}

export async function getVisibleTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.visible, true))
    .orderBy(asc(testimonials.order));
}

export async function getVisibleGalleryImages() {
  return db
    .select()
    .from(galleryImages)
    .where(eq(galleryImages.visible, true))
    .orderBy(asc(galleryImages.order));
}

export async function getVisibleStatistics() {
  return db
    .select()
    .from(statistics)
    .where(eq(statistics.visible, true))
    .orderBy(asc(statistics.order));
}
