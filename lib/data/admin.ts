import "server-only";
import { db } from "@/db/client";
import {
  skills,
  experiences,
  education,
  projects,
  certificates,
  awards,
  testimonials,
  galleryImages,
  statistics,
  socialLinks,
  contactMessages,
  media,
  activityLog,
} from "@/db/schema";
import { asc, desc } from "drizzle-orm";

export async function getAllSkillsAdmin() {
  return db.select().from(skills).orderBy(asc(skills.order));
}
export async function getAllExperiencesAdmin() {
  return db.select().from(experiences).orderBy(asc(experiences.order));
}
export async function getAllEducationAdmin() {
  return db.select().from(education).orderBy(asc(education.order));
}
export async function getAllProjectsAdmin() {
  return db.select().from(projects).orderBy(asc(projects.order));
}
export async function getAllCertificatesAdmin() {
  return db.select().from(certificates).orderBy(asc(certificates.order));
}
export async function getAllAwardsAdmin() {
  return db.select().from(awards).orderBy(asc(awards.order));
}
export async function getAllTestimonialsAdmin() {
  return db.select().from(testimonials).orderBy(asc(testimonials.order));
}
export async function getAllGalleryAdmin() {
  return db.select().from(galleryImages).orderBy(asc(galleryImages.order));
}
export async function getAllStatisticsAdmin() {
  return db.select().from(statistics).orderBy(asc(statistics.order));
}
export async function getAllSocialLinksAdmin() {
  return db.select().from(socialLinks).orderBy(asc(socialLinks.order));
}
export async function getAllMessagesAdmin() {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}
export async function getAllMediaAdmin() {
  return db.select().from(media).orderBy(desc(media.createdAt));
}
export async function getRecentActivity(limit = 15) {
  return db.select().from(activityLog).orderBy(desc(activityLog.createdAt)).limit(limit);
}
