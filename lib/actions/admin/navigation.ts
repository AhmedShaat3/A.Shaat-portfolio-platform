"use server";

import { navigationItems } from "@/db/schema";
import { navigationItemSchema } from "@/lib/validation/schemas";
import { createCrudActions } from "./generic-factory";

const actions = createCrudActions(
  navigationItems,
  navigationItemSchema,
  "navigation_item",
  "/admin/navigation"
);

export async function createNavigationItem(input: unknown) {
  return actions.create(input);
}
export async function updateNavigationItem(id: string, input: unknown) {
  return actions.update(id, input);
}
export async function deleteNavigationItem(id: string) {
  return actions.remove(id);
}
export async function reorderNavigationItems(orderedIds: string[]) {
  return actions.reorder(orderedIds);
}
