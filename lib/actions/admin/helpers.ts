import "server-only";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";

export async function requireAdmin() {
  try {
    return await requireUser();
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}

/** Revalidate every public route that could show updated content. */
export function revalidatePublicSite() {
  revalidatePath("/en", "layout");
  revalidatePath("/ar", "layout");
}

export type ActionResult<T = undefined> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export function actionError(message: string): ActionResult {
  return { ok: false, error: message };
}
