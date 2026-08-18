"use server";

import { awards } from "@/db/schema";
import { awardSchema } from "@/lib/validation/schemas";
import { createCrudActions } from "./generic-factory";

const actions = createCrudActions(awards, awardSchema, "award", "/admin/awards");

export async function createAward(input: unknown) {
  return actions.create(input);
}
export async function updateAward(id: string, input: unknown) {
  return actions.update(id, input);
}
export async function deleteAward(id: string) {
  return actions.remove(id);
}
export async function reorderAwards(orderedIds: string[]) {
  return actions.reorder(orderedIds);
}
