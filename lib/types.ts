import type { InferSelectModel } from "drizzle-orm";
import type * as schema from "@/db/schema";

// --- النماذج الأساسية ---
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

// --- النماذج المخصصة (التي تحتوي على تحويلات) ---

/**
 * نموذج المشروع المعدل.
 * تم حذف حقل 'technologies' الأساسي من قاعدة البيانات،
 * واستبداله بحقل آمن من النوع 'string[]' لضمان عدم حدوث أعطال
 * أثناء تحليل JSON في الواجهة الأمامية.
 */
export type Project = Omit<InferSelectModel<typeof schema.projects>, "technologies"> & {
  technologies: string[];
};

/**
 * خريطة المحتوى للترجمة والـ CMS.
 * تُستخدم في دالة safeParseJsonContent في public.ts
 */
export type ContentMap = Record<string, string>;

/**
 * نوع فرعي للإشارة إلى وجود صور إضافية للمشروع (يستخدم في getProjectBySlug)
 */
export type ProjectWithImages = Project & {
  images: ProjectImage[];
};