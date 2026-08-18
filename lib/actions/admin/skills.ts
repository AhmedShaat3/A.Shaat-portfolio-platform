"use server";

import { skills } from "@/db/schema";
import { skillSchema } from "@/lib/validation/schemas";
import { createCrudActions } from "./generic-factory";

const actions = createCrudActions(skills, skillSchema, "skill", "/admin/skills");

export async function createSkill(input: unknown) {
  return actions.create(input);
}
export async function updateSkill(id: string, input: unknown) {
  return actions.update(id, input);
}
export async function deleteSkill(id: string) {
  return actions.remove(id);
}
export async function reorderSkills(orderedIds: string[]) {
  return actions.reorder(orderedIds);
}
