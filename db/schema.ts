import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * DATABASE SCHEMA - PostgreSQL
 * Converted from SQLite to PostgreSQL
 */

const timestamps = {
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`(now())`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`(now())`),
};

// ---------------------------------------------------------------------------
// USERS & AUTH
// ---------------------------------------------------------------------------
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  twoFactorSecret: text("two_factor_secret"),
  twoFactorEnabled: boolean("two_factor_enabled")
    .notNull()
    .default(false),
  failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
  lockedUntil: timestamp("locked_until"),
  lastLoginAt: timestamp("last_login_at"),
  ...timestamps,
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  ...timestamps,
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// PROFILE / SITE SETTINGS
// ---------------------------------------------------------------------------
export const profile = pgTable("profile", {
  id: text("id").primaryKey().default("profile"),
  fullName: text("full_name").notNull(),
  title: text("title").notNull(),
  tagline: text("tagline"),
  typingPhrases: text("typing_phrases").notNull().default("[]"),
  bio: text("bio"),
  mission: text("mission"),
  values: text("values"),
  avatarUrl: text("avatar_url"),
  resumeUrl: text("resume_url"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  mapEmbedUrl: text("map_embed_url"),
  ...timestamps,
});

export const siteSettings = pgTable("site_settings", {
  id: text("id").primaryKey().default("settings"),
  siteTitle: text("site_title").notNull().default("Portfolio"),
  siteDescription: text("site_description"),
  keywords: text("keywords"),
  ogImageUrl: text("og_image_url"),
  author: text("author"),
  canonicalUrl: text("canonical_url"),
  defaultLocale: text("default_locale").notNull().default("en"),
  publicTheme: text("public_theme").notNull().default("dark"),
  adminTheme: text("admin_theme").notNull().default("light"),
  primaryColor: text("primary_color").notNull().default("#22D3EE"),
  logoText: text("logo_text").default("BB"),
  faviconUrl: text("favicon_url"),
  activeCvId: text("active_cv_id"),
  maintenanceMode: boolean("maintenance_mode")
    .notNull()
    .default(false),
  publishedVersion: text("published_version").notNull().default("1.0"),
  lastPublishedAt: timestamp("last_published_at"),
  ...timestamps,
});

export const contentBlocks = pgTable("content_blocks", {
  id: text("id").primaryKey(),
  section: text("section").notNull(),
  key: text("key").notNull(),
  locale: text("locale").notNull().default("en"),
  value: text("value").notNull().default(""),
  isDraft: boolean("is_draft").notNull().default(false),
  draftValue: text("draft_value"),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// NAVIGATION & SECTIONS
// ---------------------------------------------------------------------------
export const navigationItems = pgTable("navigation_items", {
  id: text("id").primaryKey(),
  labelEn: text("label_en").notNull(),
  labelAr: text("label_ar"),
  url: text("url").notNull(),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  openInNewTab: boolean("open_in_new_tab")
    .notNull()
    .default(false),
  ...timestamps,
});

export const sections = pgTable("sections", {
  id: text("id").primaryKey(),
  labelEn: text("label_en").notNull(),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  ...timestamps,
});

export const socialLinks = pgTable("social_links", {
  id: text("id").primaryKey(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  icon: text("icon").notNull().default("link"),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// SKILLS
// ---------------------------------------------------------------------------
export const skills = pgTable("skills", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("code"),
  category: text("category").notNull(),
  proficiency: integer("proficiency").notNull().default(70),
  description: text("description"),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// EXPERIENCE
// ---------------------------------------------------------------------------
export const experiences = pgTable("experiences", {
  id: text("id").primaryKey(),
  company: text("company").notNull(),
  logoUrl: text("logo_url"),
  position: text("position").notNull(),
  description: text("description"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  technologies: text("technologies").notNull().default("[]"),
  achievements: text("achievements").notNull().default("[]"),
  location: text("location"),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// EDUCATION
// ---------------------------------------------------------------------------
export const education = pgTable("education", {
  id: text("id").primaryKey(),
  university: text("university").notNull(),
  degree: text("degree").notNull(),
  major: text("major"),
  gpa: text("gpa"),
  startYear: text("start_year").notNull(),
  endYear: text("end_year"),
  coursework: text("coursework").notNull().default("[]"),
  description: text("description"),
  logoUrl: text("logo_url"),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------
export const projects = pgTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description"),
  fullDescription: text("full_description"),
  category: text("category").notNull(),
  technologies: text("technologies").notNull().default("[]"),
  mainImageUrl: text("main_image_url"),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  featured: boolean("featured").notNull().default(false),
  status: text("status").notNull().default("completed"),
  stats: text("stats").notNull().default("[]"),
  challenges: text("challenges"),
  solution: text("solution"),
  results: text("results"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  order: integer("order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  isDraft: boolean("is_draft").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  ...timestamps,
});

export const projectImages = pgTable("project_images", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull().references(() => projects.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  caption: text("caption"),
  altText: text("alt_text"),
  order: integer("order").notNull().default(0),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// CERTIFICATES
// ---------------------------------------------------------------------------
export const certificates = pgTable("certificates", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  organization: text("organization").notNull(),
  imageUrl: text("image_url"),
  pdfUrl: text("pdf_url"),
  date: text("date").notNull(),
  certificateId: text("certificate_id"),
  verificationUrl: text("verification_url"),
  description: text("description"),
  featured: boolean("featured").notNull().default(false),
  order: integer("order").notNull().default(0),
  published: boolean("published").notNull().default(true),
  viewCount: integer("view_count").notNull().default(0),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// AWARDS
// ---------------------------------------------------------------------------
export const awards = pgTable("awards", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date"),
  icon: text("icon").notNull().default("award"),
  imageUrl: text("image_url"),
  organization: text("organization"),
  featured: boolean("featured").notNull().default(false),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// TESTIMONIALS
// ---------------------------------------------------------------------------
export const testimonials = pgTable("testimonials", {
  id: text("id").primaryKey(),
  person: text("person").notNull(),
  position: text("position"),
  company: text("company"),
  photoUrl: text("photo_url"),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  date: text("date"),
  isPlaceholder: boolean("is_placeholder")
    .notNull()
    .default(true),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// GALLERY
// ---------------------------------------------------------------------------
export const galleryImages = pgTable("gallery_images", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  caption: text("caption"),
  category: text("category").notNull().default("Other"),
  altText: text("alt_text"),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// STATISTICS
// ---------------------------------------------------------------------------
export const statistics = pgTable("statistics", {
  id: text("id").primaryKey(),
  labelEn: text("label_en").notNull(),
  labelAr: text("label_ar"),
  value: integer("value").notNull().default(0),
  suffix: text("suffix").default(""),
  icon: text("icon").notNull().default("bar-chart"),
  order: integer("order").notNull().default(0),
  visible: boolean("visible").notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// MEDIA LIBRARY
// ---------------------------------------------------------------------------
export const media = pgTable("media", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull().default(0),
  width: integer("width"),
  height: integer("height"),
  altText: text("alt_text"),
  folder: text("folder").notNull().default("other"),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// CONTACT MESSAGES
// ---------------------------------------------------------------------------
export const contactMessages = pgTable("contact_messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  ipAddress: text("ip_address"),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// ANALYTICS
// ---------------------------------------------------------------------------
export const analyticsEvents = pgTable("analytics_events", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  path: text("path"),
  refId: text("ref_id"),
  referrer: text("referrer"),
  deviceType: text("device_type"),
  country: text("country"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`(now())`),
});

// ---------------------------------------------------------------------------
// ACTIVITY LOG
// ---------------------------------------------------------------------------
export const activityLog = pgTable("activity_log", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  details: text("details"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`(now())`),
});

// ---------------------------------------------------------------------------
// SITE VERSIONS
// ---------------------------------------------------------------------------
export const siteVersions = pgTable("site_versions", {
  id: text("id").primaryKey(),
  version: text("version").notNull(),
  label: text("label"),
  snapshot: text("snapshot").notNull(),
  publishedBy: text("published_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`(now())`),
});