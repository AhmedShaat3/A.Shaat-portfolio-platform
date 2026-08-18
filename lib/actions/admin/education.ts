"use server";

import { education } from "@/db/schema";
import { educationSchema } from "@/lib/validation/schemas";
import { createCrudActions } from "./generic-factory";

const actions = createCrudActions(education, educationSchema, "education", "/admin/education");

export async function createEducation(input: unknown) {
  return actions.create(input);
}
export async function updateEducation(id: string, input: unknown) {
  return actions.update(id, input);
}
export async function deleteEducation(id: string) {
  return actions.remove(id);
}
export async function reorderEducation(orderedIds: string[]) {
  return actions.reorder(orderedIds);
}
