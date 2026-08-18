import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * DATABASE SCHEMA
 * -----------------------------------------------------------------------
 * Written with Drizzle ORM against SQLite for local development.
 *
 * PRODUCTION NOTE: To move to PostgreSQL, swap the driver in db/client.ts
 * from `better-sqlite3` to `postgres-js` (or `@vercel/postgres`) and swap
 * the column helpers below from `sqlite-core` to `pg-core`. The table/
 * column shapes are intentionally written in a Postgres-compatible way
 * (no SQLite-only types) so that migration is a driver + import swap, not
 * a redesign. See SETUP.md for the exact steps.
 * -----------------------------------------------------------------------
 */

const timestamps = {
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
};

// ---------------------------------------------------------------------------
// USERS & AUTH
// ---------------------------------------------------------------------------
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"), // admin | editor
  twoFactorSecret: text("two_factor_secret"), // architecture only, not enforced
  twoFactorEnabled: integer("two_factor_enabled", { mode: "boolean" })
    .notNull()
    .default(false),
  failedLoginAttempts: integer("failed_login_attempts").notNull().default(0),
  lockedUntil: text("locked_until"),
  lastLoginAt: text("last_login_at"),
  ...timestamps,
});

export const passwordResetTokens = sqliteTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  usedAt: text("used_at"),
  ...timestamps,
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(), // session token (opaque, random)
  userId: text("user_id").notNull(),
  expiresAt: text("expires_at").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// PROFILE / SITE SETTINGS
// ---------------------------------------------------------------------------
export const profile = sqliteTable("profile", {
  id: text("id").primaryKey().default("profile"),
  fullName: text("full_name").notNull(),
  title: text("title").notNull(), // "Cybersecurity • AI • Software Engineering"
  tagline: text("tagline"), // short intro
  typingPhrases: text("typing_phrases").notNull().default("[]"), // JSON string[]
  bio: text("bio"), // rich text HTML
  mission: text("mission"),
  values: text("values"), // JSON string[]
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

export const siteSettings = sqliteTable("site_settings", {
  id: text("id").primaryKey().default("settings"),
  siteTitle: text("site_title").notNull().default("Portfolio"),
  siteDescription: text("site_description"),
  keywords: text("keywords"), // comma separated
  ogImageUrl: text("og_image_url"),
  author: text("author"),
  canonicalUrl: text("canonical_url"),
  defaultLocale: text("default_locale").notNull().default("en"), // en | ar
  publicTheme: text("public_theme").notNull().default("dark"), // dark | light
  adminTheme: text("admin_theme").notNull().default("light"),
  primaryColor: text("primary_color").notNull().default("#22D3EE"),
  logoText: text("logo_text").default("BB"),
  faviconUrl: text("favicon_url"),
  activeCvId: text("active_cv_id"),
  maintenanceMode: integer("maintenance_mode", { mode: "boolean" })
    .notNull()
    .default(false),
  publishedVersion: text("published_version").notNull().default("1.0"),
  lastPublishedAt: text("last_published_at"),
  ...timestamps,
});

// Every editable text block on the site (hero heading, about copy, section
// titles/subtitles, footer text, CTA labels, etc). Keyed so it can be
// looked up per-locale without hardcoding strings in components.
export const contentBlocks = sqliteTable("content_blocks", {
  id: text("id").primaryKey(),
  section: text("section").notNull(), // hero | about | skills | contact | footer ...
  key: text("key").notNull(), // heading | subheading | body | cta_label ...
  locale: text("locale").notNull().default("en"), // en | ar
  value: text("value").notNull().default(""),
  isDraft: integer("is_draft", { mode: "boolean" }).notNull().default(false),
  draftValue: text("draft_value"),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// NAVIGATION & SECTIONS
// ---------------------------------------------------------------------------
export const navigationItems = sqliteTable("navigation_items", {
  id: text("id").primaryKey(),
  labelEn: text("label_en").notNull(),
  labelAr: text("label_ar"),
  url: text("url").notNull(),
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  openInNewTab: integer("open_in_new_tab", { mode: "boolean" })
    .notNull()
    .default(false),
  ...timestamps,
});

export const sections = sqliteTable("sections", {
  id: text("id").primaryKey(), // hero | about | skills | experience | projects ...
  labelEn: text("label_en").notNull(),
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const socialLinks = sqliteTable("social_links", {
  id: text("id").primaryKey(),
  platform: text("platform").notNull(), // github | linkedin | twitter | email
  url: text("url").notNull(),
  icon: text("icon").notNull().default("link"),
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// SKILLS
// ---------------------------------------------------------------------------
export const skills = sqliteTable("skills", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull().default("code"), // lucide icon name
  category: text("category").notNull(), // Cybersecurity | AI | ...
  proficiency: integer("proficiency").notNull().default(70), // 0-100
  description: text("description"),
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// EXPERIENCE
// ---------------------------------------------------------------------------
export const experiences = sqliteTable("experiences", {
  id: text("id").primaryKey(),
  company: text("company").notNull(),
  logoUrl: text("logo_url"),
  position: text("position").notNull(),
  description: text("description"), // rich text
  startDate: text("start_date").notNull(), // YYYY-MM
  endDate: text("end_date"), // null = present
  technologies: text("technologies").notNull().default("[]"), // JSON string[]
  achievements: text("achievements").notNull().default("[]"), // JSON string[]
  location: text("location"),
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// EDUCATION
// ---------------------------------------------------------------------------
export const education = sqliteTable("education", {
  id: text("id").primaryKey(),
  university: text("university").notNull(),
  degree: text("degree").notNull(),
  major: text("major"),
  gpa: text("gpa"),
  startYear: text("start_year").notNull(),
  endYear: text("end_year"),
  coursework: text("coursework").notNull().default("[]"), // JSON string[]
  description: text("description"),
  logoUrl: text("logo_url"),
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// PROJECTS
// ---------------------------------------------------------------------------
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  shortDescription: text("short_description"),
  fullDescription: text("full_description"), // rich text
  category: text("category").notNull(), // Cybersecurity | AI | ML | DevOps ...
  technologies: text("technologies").notNull().default("[]"), // JSON string[]
  mainImageUrl: text("main_image_url"),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  status: text("status").notNull().default("completed"), // completed | in-progress | archived
  stats: text("stats").notNull().default("[]"), // JSON [{label,value}]
  challenges: text("challenges"), // rich text
  solution: text("solution"), // rich text
  results: text("results"), // rich text
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  order: integer("order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  isDraft: integer("is_draft", { mode: "boolean" }).notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  ...timestamps,
});

export const projectImages = sqliteTable("project_images", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  url: text("url").notNull(),
  caption: text("caption"),
  altText: text("alt_text"),
  order: integer("order").notNull().default(0),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// CERTIFICATES
// ---------------------------------------------------------------------------
export const certificates = sqliteTable("certificates", {
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
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  order: integer("order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  viewCount: integer("view_count").notNull().default(0),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// AWARDS
// ---------------------------------------------------------------------------
export const awards = sqliteTable("awards", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: text("date"),
  icon: text("icon").notNull().default("award"),
  imageUrl: text("image_url"),
  organization: text("organization"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// TESTIMONIALS
// ---------------------------------------------------------------------------
export const testimonials = sqliteTable("testimonials", {
  id: text("id").primaryKey(),
  person: text("person").notNull(),
  position: text("position"),
  company: text("company"),
  photoUrl: text("photo_url"),
  quote: text("quote").notNull(),
  rating: integer("rating").notNull().default(5),
  date: text("date"),
  isPlaceholder: integer("is_placeholder", { mode: "boolean" })
    .notNull()
    .default(true),
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// GALLERY
// ---------------------------------------------------------------------------
export const galleryImages = sqliteTable("gallery_images", {
  id: text("id").primaryKey(),
  url: text("url").notNull(),
  caption: text("caption"),
  category: text("category").notNull().default("Other"),
  altText: text("alt_text"),
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// STATISTICS (animated counters)
// ---------------------------------------------------------------------------
export const statistics = sqliteTable("statistics", {
  id: text("id").primaryKey(),
  labelEn: text("label_en").notNull(),
  labelAr: text("label_ar"),
  value: integer("value").notNull().default(0),
  suffix: text("suffix").default(""), // e.g. "+"
  icon: text("icon").notNull().default("bar-chart"),
  order: integer("order").notNull().default(0),
  visible: integer("visible", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// MEDIA LIBRARY
// ---------------------------------------------------------------------------
export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull().default(0), // bytes
  width: integer("width"),
  height: integer("height"),
  altText: text("alt_text"),
  folder: text("folder").notNull().default("other"), // profile|projects|certificates|gallery|logos|other
  ...timestamps,
});

// ---------------------------------------------------------------------------
// CONTACT MESSAGES
// ---------------------------------------------------------------------------
export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject"),
  message: text("message").notNull(),
  read: integer("read", { mode: "boolean" }).notNull().default(false),
  ipAddress: text("ip_address"),
  ...timestamps,
});

// ---------------------------------------------------------------------------
// ANALYTICS
// ---------------------------------------------------------------------------
export const analyticsEvents = sqliteTable("analytics_events", {
  id: text("id").primaryKey(),
  type: text("type").notNull(), // page_view | project_view | certificate_view
  path: text("path"),
  refId: text("ref_id"), // project/certificate id when applicable
  referrer: text("referrer"),
  deviceType: text("device_type"), // desktop | mobile | tablet
  country: text("country"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// ---------------------------------------------------------------------------
// ACTIVITY LOG (admin audit trail)
// ---------------------------------------------------------------------------
export const activityLog = sqliteTable("activity_log", {
  id: text("id").primaryKey(),
  userId: text("user_id"),
  action: text("action").notNull(), // e.g. "project.created"
  entityType: text("entity_type"),
  entityId: text("entity_id"),
  details: text("details"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

// ---------------------------------------------------------------------------
// SITE VERSIONS (publish/draft snapshots)
// ---------------------------------------------------------------------------
export const siteVersions = sqliteTable("site_versions", {
  id: text("id").primaryKey(),
  version: text("version").notNull(), // "1.0", "1.1" ...
  label: text("label"),
  snapshot: text("snapshot").notNull(), // JSON blob of publishable state
  publishedBy: text("published_by"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});
