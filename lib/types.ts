import type { InferSelectModel } from "drizzle-orm";
import type * as schema from "@/db/schema";

// --- النماذج الأساسية القادمة المباشرة من قاعدة البيانات ---
export type Profile = InferSelectModel<typeof schema.profile>;
export type SiteSettings = InferSelectModel<typeof schema.siteSettings>;
export type NavigationItem = InferSelectModel<typeof schema.navigationItems>;
export type Section = InferSelectModel<typeof schema.sections>;
export type SocialLink = InferSelectModel<typeof schema.socialLinks>;
export type Skill = InferSelectModel<typeof schema.skills>;
export type Experience = InferSelectModel<typeof schema.experiences>;
export type Education = InferSelectModel<typeof schema.education>;
export type ProjectImage = InferSelectModel<typeof schema.projectImages>;
export type Certificate = InferSelectModel<typeof schema.certificates>;
export type Award = InferSelectModel<typeof schema.awards>;
export type Testimonial = InferSelectModel<typeof schema.testimonials>;
export type GalleryImage = InferSelectModel<typeof schema.galleryImages>;
export type Statistic = InferSelectModel<typeof schema.statistics>;
export type Media = InferSelectModel<typeof schema.media>;
export type ContactMessage = InferSelectModel<typeof schema.contactMessages>;
export type ContentBlock = InferSelectModel<typeof schema.contentBlocks>;
export type User = InferSelectModel<typeof schema.users>;

// --- النماذج المخصصة للواجهات ---

/**
 * نموذج المشروع الأصلي لقاعدة البيانات ولوحة التحكم (Admin)
 * حيث تكون التقنيات مسجلة كنص متصل string
 */
export type AdminProject = InferSelectModel<typeof schema.projects>;

/**
 * نموذج المشروع المحلل والمخصص للعرض العام (Client Side)
 * حيث يتم تحليل التقنيات مسبقاً وتحويلها إلى مصفوفة string[]
 */
export type Project = Omit<AdminProject, "technologies"> & {
  technologies: string[];
};

export type ContentMap = Record<string, string>;

export type ProjectWithImages = Project & {
  images: ProjectImage[];
};