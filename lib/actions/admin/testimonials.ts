"use server";

import { testimonials } from "@/db/schema";
import { testimonialSchema } from "@/lib/validation/schemas";
import { createCrudActions } from "./generic-factory";

const actions = createCrudActions(
  testimonials,
  testimonialSchema,
  "testimonial",
  "/admin/testimonials"
);

export async function createTestimonial(input: unknown) {
  return actions.create(input);
}
export async function updateTestimonial(id: string, input: unknown) {
  return actions.update(id, input);
}
export async function deleteTestimonial(id: string) {
  return actions.remove(id);
}
export async function reorderTestimonials(orderedIds: string[]) {
  return actions.reorder(orderedIds);
}
