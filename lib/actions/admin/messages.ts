"use server";

import { db } from "@/db/client";
import { contactMessages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin, type ActionResult } from "./helpers";
import { revalidatePath } from "next/cache";

export async function markMessageRead(id: string, read: boolean): Promise<ActionResult> {
  await requireAdmin();
  await db.update(contactMessages).set({ read }).where(eq(contactMessages.id, id));
  revalidatePath("/admin/messages");
  return { ok: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  await requireAdmin();
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  revalidatePath("/admin/messages");
  return { ok: true };
}
