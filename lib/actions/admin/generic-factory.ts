import "server-only";

import { db } from "@/db/client";
import { eq } from "drizzle-orm";
import type { SQLiteTable } from "drizzle-orm/sqlite-core";
import { nanoid } from "@/lib/utils/id";
import {
  requireAdmin,
  revalidatePublicSite,
  type ActionResult,
} from "./helpers";
import { logActivity } from "@/lib/activity";
import { revalidatePath } from "next/cache";
import type { ZodType } from "zod";

/**
 * Converts JavaScript arrays into JSON strings before storing them
 * in SQLite TEXT columns.
 *
 * Example:
 * ["Python", "AWS", "Linux"]
 *
 * becomes:
 * '["Python","AWS","Linux"]'
 */
function serializeDbValues(
  values: Record<string, unknown>
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => [
      key,
      Array.isArray(value) ? JSON.stringify(value) : value,
    ])
  );
}

/**
 * Builds create/update/delete/reorder server actions for a straightforward
 * table (id + zod-validated fields, optionally order/visible).
 *
 * Used for simpler CMS entities such as:
 * - Awards
 * - Testimonials
 * - Gallery
 * - Navigation
 * - Social Links
 * - Statistics
 * - Experience
 * - Other CRUD-based entities
 */
export function createCrudActions<
  TTable extends SQLiteTable & { id: unknown }
>(
  table: TTable,
  schema: ZodType,
  entityName: string,
  adminPath: string
) {
  // Drizzle's generic table types don't narrow well through a shared helper.
  // The actual columns/shape are enforced by each entity's Zod schema.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = table as any;

  /**
   * CREATE
   */
  async function create(
    input: unknown
  ): Promise<ActionResult<{ id: string }>> {
    const user = await requireAdmin();

    const parsed = schema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error:
          parsed.error.issues[0]?.message ??
          "Invalid input.",
      };
    }

    const id = nanoid();

    // Convert arrays to JSON strings before inserting into SQLite.
    const values = serializeDbValues(
      parsed.data as Record<string, unknown>
    );

    await db.insert(t).values({
      id,
      ...values,
    });

    await logActivity({
      userId: user.id,
      action: `${entityName}.created`,
      entityType: entityName,
      entityId: id,
    });

    revalidatePath(adminPath);
    revalidatePublicSite();

    return {
      ok: true,
      data: { id },
    };
  }

  /**
   * UPDATE
   */
  async function update(
    id: string,
    input: unknown
  ): Promise<ActionResult> {
    const user = await requireAdmin();

    const parsed = schema.safeParse(input);

    if (!parsed.success) {
      return {
        ok: false,
        error:
          parsed.error.issues[0]?.message ??
          "Invalid input.",
      };
    }

    // Convert arrays to JSON strings before updating SQLite.
    const values = serializeDbValues(
      parsed.data as Record<string, unknown>
    );

    await db
      .update(t)
      .set(values)
      .where(eq(t.id, id));

    await logActivity({
      userId: user.id,
      action: `${entityName}.updated`,
      entityType: entityName,
      entityId: id,
    });

    revalidatePath(adminPath);
    revalidatePublicSite();

    return {
      ok: true,
    };
  }

  /**
   * DELETE
   */
  async function remove(
    id: string
  ): Promise<ActionResult> {
    const user = await requireAdmin();

    await db
      .delete(t)
      .where(eq(t.id, id));

    await logActivity({
      userId: user.id,
      action: `${entityName}.deleted`,
      entityType: entityName,
      entityId: id,
    });

    revalidatePath(adminPath);
    revalidatePublicSite();

    return {
      ok: true,
    };
  }

  /**
   * REORDER
   */
  async function reorder(
    orderedIds: string[]
  ): Promise<ActionResult> {
    await requireAdmin();

    await Promise.all(
      orderedIds.map((id, index) =>
        db
          .update(t)
          .set({
            order: index,
          })
          .where(eq(t.id, id))
      )
    );

    revalidatePath(adminPath);
    revalidatePublicSite();

    return {
      ok: true,
    };
  }

  return {
    create,
    update,
    remove,
    reorder,
  };
}