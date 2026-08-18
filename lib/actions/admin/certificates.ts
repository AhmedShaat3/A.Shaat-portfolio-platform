"use server";

import { db } from "@/db/client";
import { certificates } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { nanoid } from "@/lib/utils/id";
import { certificateSchema } from "@/lib/validation/schemas";
import { requireAdmin, revalidatePublicSite, type ActionResult } from "./helpers";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";

async function assertUniqueSlug(slug: string, excludeId?: string) {
  const existing = await db
    .select({ id: certificates.id })
    .from(certificates)
    .where(
      excludeId
        ? and(eq(certificates.slug, slug), ne(certificates.id, excludeId))
        : eq(certificates.slug, slug)
    )
    .limit(1);
  return existing.length === 0;
}

export async function createCertificate(input: unknown): Promise<ActionResult<{ id: string }>> {
  const user = await requireAdmin();
  const parsed = certificateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  if (!(await assertUniqueSlug(parsed.data.slug))) {
    return { ok: false, error: "That slug is already in use by another certificate." };
  }
  const id = nanoid();
  await db.insert(certificates).values({ id, ...parsed.data });
  await logActivity({ userId: user.id, action: "certificate.created", entityType: "certificate", entityId: id });
  revalidatePath("/admin/certificates");
  revalidatePublicSite();
  return { ok: true, data: { id } };
}

export async function updateCertificate(id: string, input: unknown): Promise<ActionResult> {
  const user = await requireAdmin();
  const parsed = certificateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  if (!(await assertUniqueSlug(parsed.data.slug, id))) {
    return { ok: false, error: "That slug is already in use by another certificate." };
  }
  await db.update(certificates).set(parsed.data).where(eq(certificates.id, id));
  await logActivity({ userId: user.id, action: "certificate.updated", entityType: "certificate", entityId: id });
  revalidatePath("/admin/certificates");
  revalidatePublicSite();
  return { ok: true };
}

export async function deleteCertificate(id: string): Promise<ActionResult> {
  const user = await requireAdmin();
  await db.delete(certificates).where(eq(certificates.id, id));
  await logActivity({ userId: user.id, action: "certificate.deleted", entityType: "certificate", entityId: id });
  revalidatePath("/admin/certificates");
  revalidatePublicSite();
  return { ok: true };
}

export async function reorderCertificates(orderedIds: string[]): Promise<ActionResult> {
  await requireAdmin();
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(certificates).set({ order: index }).where(eq(certificates.id, id))
    )
  );
  revalidatePath("/admin/certificates");
  revalidatePublicSite();
  return { ok: true };
}
