"use server";

import { db } from "@/db/client";
import { sections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, revalidatePublicSite, type ActionResult } from "./helpers";
import { revalidatePath } from "next/cache";

export async function reorderSections(orderedIds: string[]): Promise<ActionResult> {
  await requireAdmin();
  await Promise.all(
    orderedIds.map((id, index) => db.update(sections).set({ order: index }).where(eq(sections.id, id)))
  );
  revalidatePath("/admin/sections");
  revalidatePublicSite();
  return { ok: true };
}

export async function toggleSectionVisibility(id: string, visible: boolean): Promise<ActionResult> {
  await requireAdmin();
  await db.update(sections).set({ visible }).where(eq(sections.id, id));
  revalidatePath("/admin/sections");
  revalidatePublicSite();
  return { ok: true };
}
