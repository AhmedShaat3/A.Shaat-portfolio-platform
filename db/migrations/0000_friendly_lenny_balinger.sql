CREATE TABLE `activity_log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`action` text NOT NULL,
	`entity_type` text,
	`entity_id` text,
	`details` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `analytics_events` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`path` text,
	`ref_id` text,
	`referrer` text,
	`device_type` text,
	`country` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `awards` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`date` text,
	`icon` text DEFAULT 'award' NOT NULL,
	`image_url` text,
	`organization` text,
	`featured` integer DEFAULT false NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`organization` text NOT NULL,
	`image_url` text,
	`pdf_url` text,
	`date` text NOT NULL,
	`certificate_id` text,
	`verification_url` text,
	`description` text,
	`featured` integer DEFAULT false NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `certificates_slug_unique` ON `certificates` (`slug`);--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`subject` text,
	`message` text NOT NULL,
	`read` integer DEFAULT false NOT NULL,
	`ip_address` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `content_blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`section` text NOT NULL,
	`key` text NOT NULL,
	`locale` text DEFAULT 'en' NOT NULL,
	`value` text DEFAULT '' NOT NULL,
	`is_draft` integer DEFAULT false NOT NULL,
	`draft_value` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` text PRIMARY KEY NOT NULL,
	`university` text NOT NULL,
	`degree` text NOT NULL,
	`major` text,
	`gpa` text,
	`start_year` text NOT NULL,
	`end_year` text,
	`coursework` text DEFAULT '[]' NOT NULL,
	`description` text,
	`logo_url` text,
	`order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `experiences` (
	`id` text PRIMARY KEY NOT NULL,
	`company` text NOT NULL,
	`logo_url` text,
	`position` text NOT NULL,
	`description` text,
	`start_date` text NOT NULL,
	`end_date` text,
	`technologies` text DEFAULT '[]' NOT NULL,
	`achievements` text DEFAULT '[]' NOT NULL,
	`location` text,
	`order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `gallery_images` (
	`id` text PRIMARY KEY NOT NULL,
	`url` text NOT NULL,
	`caption` text,
	`category` text DEFAULT 'Other' NOT NULL,
	`alt_text` text,
	`order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`original_name` text NOT NULL,
	`url` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer DEFAULT 0 NOT NULL,
	`width` integer,
	`height` integer,
	`alt_text` text,
	`folder` text DEFAULT 'other' NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `navigation_items` (
	`id` text PRIMARY KEY NOT NULL,
	`label_en` text NOT NULL,
	`label_ar` text,
	`url` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`open_in_new_tab` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `password_reset_tokens` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`token` text NOT NULL,
	`expires_at` text NOT NULL,
	`used_at` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `password_reset_tokens_token_unique` ON `password_reset_tokens` (`token`);--> statement-breakpoint
CREATE TABLE `profile` (
	`id` text PRIMARY KEY DEFAULT 'profile' NOT NULL,
	`full_name` text NOT NULL,
	`title` text NOT NULL,
	`tagline` text,
	`typing_phrases` text DEFAULT '[]' NOT NULL,
	`bio` text,
	`mission` text,
	`values` text,
	`avatar_url` text,
	`resume_url` text,
	`email` text,
	`phone` text,
	`location` text,
	`github_url` text,
	`linkedin_url` text,
	`twitter_url` text,
	`map_embed_url` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `project_images` (
	`id` text PRIMARY KEY NOT NULL,
	`project_id` text NOT NULL,
	`url` text NOT NULL,
	`caption` text,
	`alt_text` text,
	`order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`short_description` text,
	`full_description` text,
	`category` text NOT NULL,
	`technologies` text DEFAULT '[]' NOT NULL,
	`main_image_url` text,
	`github_url` text,
	`live_url` text,
	`featured` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'completed' NOT NULL,
	`stats` text DEFAULT '[]' NOT NULL,
	`challenges` text,
	`solution` text,
	`results` text,
	`seo_title` text,
	`seo_description` text,
	`order` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`is_draft` integer DEFAULT false NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE TABLE `sections` (
	`id` text PRIMARY KEY NOT NULL,
	`label_en` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`user_agent` text,
	`ip_address` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` text PRIMARY KEY DEFAULT 'settings' NOT NULL,
	`site_title` text DEFAULT 'Portfolio' NOT NULL,
	`site_description` text,
	`keywords` text,
	`og_image_url` text,
	`author` text,
	`canonical_url` text,
	`default_locale` text DEFAULT 'en' NOT NULL,
	`public_theme` text DEFAULT 'dark' NOT NULL,
	`admin_theme` text DEFAULT 'light' NOT NULL,
	`primary_color` text DEFAULT '#22D3EE' NOT NULL,
	`logo_text` text DEFAULT 'BB',
	`favicon_url` text,
	`active_cv_id` text,
	`maintenance_mode` integer DEFAULT false NOT NULL,
	`published_version` text DEFAULT '1.0' NOT NULL,
	`last_published_at` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`version` text NOT NULL,
	`label` text,
	`snapshot` text NOT NULL,
	`published_by` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`icon` text DEFAULT 'code' NOT NULL,
	`category` text NOT NULL,
	`proficiency` integer DEFAULT 70 NOT NULL,
	`description` text,
	`order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `social_links` (
	`id` text PRIMARY KEY NOT NULL,
	`platform` text NOT NULL,
	`url` text NOT NULL,
	`icon` text DEFAULT 'link' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `statistics` (
	`id` text PRIMARY KEY NOT NULL,
	`label_en` text NOT NULL,
	`label_ar` text,
	`value` integer DEFAULT 0 NOT NULL,
	`suffix` text DEFAULT '',
	`icon` text DEFAULT 'bar-chart' NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`person` text NOT NULL,
	`position` text,
	`company` text,
	`photo_url` text,
	`quote` text NOT NULL,
	`rating` integer DEFAULT 5 NOT NULL,
	`date` text,
	`is_placeholder` integer DEFAULT true NOT NULL,
	`order` integer DEFAULT 0 NOT NULL,
	`visible` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`two_factor_secret` text,
	`two_factor_enabled` integer DEFAULT false NOT NULL,
	`failed_login_attempts` integer DEFAULT 0 NOT NULL,
	`locked_until` text,
	`last_login_at` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);