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
  sectionContent,
} from "@/db/schema";
import { eq, desc, asc, and } from "drizzle-orm";
import type { ContentMap } from "@/lib/types";

// --- دوال الأمان للـ JSON ---

// دالة آمنة لمحتوى الأقسام
function safeParseJsonContent(rawContent: unknown): ContentMap {
  if (!rawContent) return {};
  if (typeof rawContent === "object") return rawContent as ContentMap;
  if (typeof rawContent === "string") {
    try {
      return JSON.parse(rawContent) as ContentMap;
    } catch {
      return {};
    }
  }
  return {};
}

// دالة آمنة خاصة بتقنيات المشاريع (لأنها تسبب المشكلة الأكبر)
function safeParseTechnologies(rawTech: unknown): string[] {
  if (!rawTech) return [];
  if (typeof rawTech === "string") {
    try {
      // محاولة تحويلها كـ JSON
      return JSON.parse(rawTech);
    } catch {
      // في حال كانت نصاً عادياً مفصولاً بفواصل
      return rawTech.split(",").map((t) => t.trim());
    }
  }
  return [];
}

// --- دوال قاعدة البيانات ---

export async function getSectionContent(
  sectionId: string,
  locale: string
): Promise<ContentMap> {
  try {
    const [row] = await db
      .select()
      .from(sectionContent)
      .where(
        and(
          eq(sectionContent.sectionId, sectionId),
          eq(sectionContent.locale, locale)
        )
      )
      .limit(1);

    if (!row || !row.content) return {};
    return safeParseJsonContent(row.content);
  } catch (error) {
    console.error(`Error fetching section content for ${sectionId}:`, error);
    return {};
  }
}

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
  // ✅ أخذ المشاريع، ثم تحويل تقنياتها لصفيف آمن
  const rawProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.order));

  return rawProjects.map((p) => ({
    ...p,
    // تحويل التقنيات لصفيف آمن
    technologies: safeParseTechnologies(p.technologies),
  }));
}

export async function getFeaturedProjects() {
  const rawProjects = await db
    .select()
    .from(projects)
    .where(and(eq(projects.published, true), eq(projects.featured, true)))
    .orderBy(asc(projects.order));

  return rawProjects.map((p) => ({
    ...p,
    technologies: safeParseTechnologies(p.technologies),
  }));
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

  return { 
    ...row, 
    // ✅ تحويل التقنيات لصفيف آمن
    technologies: safeParseTechnologies(row.technologies),
    images 
  };
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