"use server";

import { galleryImages } from "@/db/schema";
import { galleryImageSchema } from "@/lib/validation/schemas";
import { createCrudActions } from "./generic-factory";

const actions = createCrudActions(
  galleryImages,
  galleryImageSchema,
  "gallery_image",
  "/admin/gallery"
);

export async function createGalleryImage(input: unknown) {
  return actions.create(input);
}
export async function updateGalleryImage(id: string, input: unknown) {
  return actions.update(id, input);
}
export async function deleteGalleryImage(id: string) {
  return actions.remove(id);
}
export async function reorderGalleryImages(orderedIds: string[]) {
  return actions.reorder(orderedIds);
}
