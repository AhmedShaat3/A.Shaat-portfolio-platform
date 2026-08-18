"use server";

import { socialLinks } from "@/db/schema";
import { socialLinkSchema } from "@/lib/validation/schemas";
import { createCrudActions } from "./generic-factory";

const actions = createCrudActions(socialLinks, socialLinkSchema, "social_link", "/admin/content");

export async function createSocialLink(input: unknown) {
  return actions.create(input);
}
export async function updateSocialLink(id: string, input: unknown) {
  return actions.update(id, input);
}
export async function deleteSocialLink(id: string) {
  return actions.remove(id);
}
export async function reorderSocialLinks(orderedIds: string[]) {
  return actions.reorder(orderedIds);
}
