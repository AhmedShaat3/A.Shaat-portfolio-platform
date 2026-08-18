"use server";

import { db } from "@/db/client";
import { projects, projectImages } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { nanoid } from "@/lib/utils/id";
import { projectSchema } from "@/lib/validation/schemas";
import { requireAdmin, revalidatePublicSite, type ActionResult } from "./helpers";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

async function assertUniqueSlug(slug: string, excludeId?: string) {
  const existing = await db
    .select({ id: projects.id })
    .from(projects)
    .where(
      excludeId
        ? and(eq(projects.slug, slug), ne(projects.id, excludeId))
        : eq(projects.slug, slug)
    )
    .limit(1);
  return existing.length === 0;
}

function toDbValues(parsed: ReturnType<typeof projectSchema.parse>) {
  return {
    ...parsed,
    technologies: JSON.stringify(parsed.technologies),
    stats: JSON.stringify(parsed.stats),
  };
}

export async function createProject(input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  if (!(await assertUniqueSlug(parsed.data.slug))) {
    return { ok: false, error: "That slug is already in use by another project." };
  }

  const id = nanoid();
  await db.insert(projects).values({ id, ...toDbValues(parsed.data) });
  await logActivity({ userId: user.id, action: "project.created", entityType: "project", entityId: id });
  revalidatePath("/admin/projects");
  revalidatePublicSite();
  return { ok: true, data: { id } };
}

export async function updateProject(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireAdmin();
  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  if (!(await assertUniqueSlug(parsed.data.slug, id))) {
    return { ok: false, error: "That slug is already in use by another project." };
  }

  await db.update(projects).set(toDbValues(parsed.data)).where(eq(projects.id, id));
  await logActivity({ userId: user.id, action: "project.updated", entityType: "project", entityId: id });
  revalidatePath("/admin/projects");
  revalidatePublicSite();
  return { ok: true };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const user = await requireAdmin();
  await db.delete(projectImages).where(eq(projectImages.projectId, id));
  await db.delete(projects).where(eq(projects.id, id));
  await logActivity({ userId: user.id, action: "project.deleted", entityType: "project", entityId: id });
  revalidatePath("/admin/projects");
  revalidatePublicSite();
  return { ok: true };
}

export async function reorderProjects(orderedIds: string[]): Promise<ActionResult> {
  await requireAdmin();
  await Promise.all(
    orderedIds.map((id, index) => db.update(projects).set({ order: index }).where(eq(projects.id, id)))
  );
  revalidatePath("/admin/projects");
  revalidatePublicSite();
  return { ok: true };
}

export async function addProjectImage(
  projectId: string,
  url: string,
  caption?: string
): Promise<ActionResult<{ id: string }>> {
  await requireAdmin();
  const id = nanoid();
  await db.insert(projectImages).values({ id, projectId, url, caption, order: 0 });
  revalidatePublicSite();
  return { ok: true, data: { id } };
}

export async function deleteProjectImage(id: string): Promise<ActionResult> {
  await requireAdmin();
  await db.delete(projectImages).where(eq(projectImages.id, id));
  revalidatePublicSite();
  return { ok: true };
}
