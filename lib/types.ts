import type { InferSelectModel } from "drizzle-orm";
import type * as schema from "@/db/schema";

export type Profile = InferSelectModel<typeof schema.profile>;[cite: 14]
export type SiteSettings = InferSelectModel<typeof schema.siteSettings>;[cite: 14]
export type NavigationItem = InferSelectModel<typeof schema.navigationItems>;[cite: 14]
export type Section = InferSelectModel<typeof schema.sections>;[cite: 14]
export type SocialLink = InferSelectModel<typeof schema.socialLinks>;[cite: 14]
export type Skill = InferSelectModel<typeof schema.skills>;[cite: 14]
export type Experience = InferSelectModel<typeof schema.experiences>;[cite: 14]
export type Education = InferSelectModel<typeof schema.education>;[cite: 14]

// ✅ تعديل نوع Project ليقبل technologies كـ string[] أو string
export type Project = Omit<InferSelectModel<typeof schema.projects>, "technologies"> & {
  technologies: string[] | string;
};

export type ProjectImage = InferSelectModel<typeof schema.projectImages>;[cite: 14]
export type Certificate = InferSelectModel<typeof schema.certificates>;[cite: 14]
export type Award = InferSelectModel<typeof schema.awards>;[cite: 14]
export type Testimonial = InferSelectModel<typeof schema.testimonials>;[cite: 14]
export type GalleryImage = InferSelectModel<typeof schema.galleryImages>;[cite: 14]
export type Statistic = InferSelectModel<typeof schema.statistics>;[cite: 14]
export type Media = InferSelectModel<typeof schema.media>;[cite: 14]
export type ContactMessage = InferSelectModel<typeof schema.contactMessages>;[cite: 14]
export type ContentBlock = InferSelectModel<typeof schema.contentBlocks>;[cite: 14]
export type User = InferSelectModel<typeof schema.users>;[cite: 14]
export type ContentMap = Record<string, string>;[cite: 14]