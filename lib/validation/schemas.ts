import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2, "Name is too short.").max(120),
  email: z.string().trim().email("Enter a valid email."),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message is too short.").max(5000),
  // Honeypot field — real users never fill this in.
  company: z.string().max(0, "Spam detected.").optional().or(z.literal("")),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(1),
  title: z.string().trim().min(1),
  tagline: z.string().trim().optional().or(z.literal("")),
  typingPhrases: z.array(z.string().trim().min(1)).max(10),
  bio: z.string().optional().or(z.literal("")),
  mission: z.string().optional().or(z.literal("")),
  values: z.array(z.string().trim().min(1)).max(20),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().optional().or(z.literal("")),
  location: z.string().trim().optional().or(z.literal("")),
  githubUrl: z.string().trim().url().optional().or(z.literal("")),
  linkedinUrl: z.string().trim().url().optional().or(z.literal("")),
  twitterUrl: z.string().trim().url().optional().or(z.literal("")),
  mapEmbedUrl: z.string().trim().optional().or(z.literal("")),
});

export const siteSettingsSchema = z.object({
  siteTitle: z.string().trim().min(1),
  siteDescription: z.string().trim().optional().or(z.literal("")),
  keywords: z.string().trim().optional().or(z.literal("")),
  author: z.string().trim().optional().or(z.literal("")),
  canonicalUrl: z.string().trim().url().optional().or(z.literal("")),
  primaryColor: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/),
  logoText: z.string().trim().max(20).optional().or(z.literal("")),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1),
  icon: z.string().trim().min(1),
  category: z.string().trim().min(1),
  proficiency: z.number().int().min(0).max(100),
  description: z.string().trim().optional().or(z.literal("")),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const experienceSchema = z.object({
  company: z.string().trim().min(1),
  logoUrl: z.string().trim().optional().or(z.literal("")),
  position: z.string().trim().min(1),
  description: z.string().optional().or(z.literal("")),
  startDate: z.string().trim().min(1),
  endDate: z.string().trim().optional().or(z.literal("")),
  technologies: z.array(z.string().trim().min(1)).max(30),
  achievements: z.array(z.string().trim().min(1)).max(30),
  location: z.string().trim().optional().or(z.literal("")),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const educationSchema = z.object({
  university: z.string().trim().min(1),
  degree: z.string().trim().min(1),
  major: z.string().trim().optional().or(z.literal("")),
  gpa: z.string().trim().optional().or(z.literal("")),
  startYear: z.string().trim().min(1),
  endYear: z.string().trim().optional().or(z.literal("")),// ❌ القديم (بيطلب Array)
technologies: z.array(z.string().trim().min(1)).max(30),
stats: z.array(projectStatSchema).max(10),

// ✅ الجديد (بيقبل أي حاجة)
technologies: z.any().default(""),
stats: z.any().default(""),
  coursework: z.array(z.string().trim().min(1)).max(30),
  description: z.string().trim().optional().or(z.literal("")),
  logoUrl: z.string().trim().optional().or(z.literal("")),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const projectStatSchema = z.object({
  label: z.string().trim().min(1),
  value: z.string().trim().min(1),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1),
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  shortDescription: z.string().trim().optional().or(z.literal("")),
  fullDescription: z.string().optional().or(z.literal("")),
  category: z.string().trim().min(1),
  technologies: z.array(z.string().trim().min(1)).max(30),
  mainImageUrl: z.string().trim().optional().or(z.literal("")),
  githubUrl: z.string().trim().url().optional().or(z.literal("")),
  liveUrl: z.string().trim().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["completed", "in-progress", "archived"]).default("completed"),
  stats: z.array(projectStatSchema).max(10),
  challenges: z.string().optional().or(z.literal("")),
  solution: z.string().optional().or(z.literal("")),
  results: z.string().optional().or(z.literal("")),
  seoTitle: z.string().trim().optional().or(z.literal("")),
  seoDescription: z.string().trim().optional().or(z.literal("")),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const certificateSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  title: z.string().trim().min(1),
  organization: z.string().trim().min(1),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  pdfUrl: z.string().trim().optional().or(z.literal("")),
  date: z.string().trim().min(1),
  certificateId: z.string().trim().optional().or(z.literal("")),
  verificationUrl: z.string().trim().url().optional().or(z.literal("")),
  description: z.string().trim().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  published: z.boolean().default(true),
});

export const awardSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().optional().or(z.literal("")),
  date: z.string().trim().optional().or(z.literal("")),
  icon: z.string().trim().min(1),
  imageUrl: z.string().trim().optional().or(z.literal("")),
  organization: z.string().trim().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  person: z.string().trim().min(1),
  position: z.string().trim().optional().or(z.literal("")),
  company: z.string().trim().optional().or(z.literal("")),
  photoUrl: z.string().trim().optional().or(z.literal("")),
  quote: z.string().trim().min(1),
  rating: z.number().int().min(1).max(5),
  date: z.string().trim().optional().or(z.literal("")),
  isPlaceholder: z.boolean().default(false),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const galleryImageSchema = z.object({
  url: z.string().trim().min(1),
  caption: z.string().trim().optional().or(z.literal("")),
  category: z.string().trim().min(1),
  altText: z.string().trim().optional().or(z.literal("")),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const statisticSchema = z.object({
  labelEn: z.string().trim().min(1),
  labelAr: z.string().trim().optional().or(z.literal("")),
  value: z.number().int(),
  suffix: z.string().trim().optional().or(z.literal("")),
  icon: z.string().trim().min(1),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const navigationItemSchema = z.object({
  labelEn: z.string().trim().min(1),
  labelAr: z.string().trim().optional().or(z.literal("")),
  url: z.string().trim().min(1),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
  openInNewTab: z.boolean().default(false),
});

export const socialLinkSchema = z.object({
  platform: z.string().trim().min(1),
  url: z.string().trim().url(),
  icon: z.string().trim().min(1),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const contentBlockSchema = z.object({
  section: z.string().trim().min(1),
  key: z.string().trim().min(1),
  locale: z.enum(["en", "ar"]),
  value: z.string(),
});
