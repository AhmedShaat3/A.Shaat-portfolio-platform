"use server";

import { experiences } from "@/db/schema";
import { experienceSchema } from "@/lib/validation/schemas";
import { createCrudActions } from "./generic-factory";

const actions = createCrudActions(experiences, experienceSchema, "experience", "/admin/experience");

export async function createExperience(input: unknown) {
  return actions.create(input);
}
export async function updateExperience(id: string, input: unknown) {
  return actions.update(id, input);
}
export async function deleteExperience(id: string) {
  return actions.remove(id);
}
export async function reorderExperiences(orderedIds: string[]) {
  return actions.reorder(orderedIds);
}
