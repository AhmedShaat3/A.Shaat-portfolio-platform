"use client";

import { EntityManager } from "./ui/entity-manager";
import { Field, Input, Select, Switch } from "./ui/fields";
import { ImageUploader } from "./ui/image-uploader";
import {
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
} from "@/lib/actions/admin/gallery";
import type { GalleryImage } from "@/lib/types";

const CATEGORIES = ["Professional", "Conferences", "Events", "Workshops", "Training", "Other"];

export function GalleryManager({ items }: { items: GalleryImage[] }) {
  return (
    <EntityManager<GalleryImage>
      items={items}
      entityLabel="Image"
      actions={{
        create: createGalleryImage,
        update: updateGalleryImage,
        remove: deleteGalleryImage,
        reorder: reorderGalleryImages,
      }}
      emptyDefaults={{
        url: "",
        caption: "",
        category: "Other",
        altText: "",
        order: items.length,
        visible: true,
      }}
      renderItem={(item) => ({ title: item.caption || "Untitled", subtitle: item.category })}
      renderForm={(value, setValue) => (
        <>
          <Field label="Image" required>
            <ImageUploader
              value={value.url ?? ""}
              onChange={(url) => setValue({ ...value, url })}
              folder="gallery"
            />
          </Field>
          <Field label="Caption">
            <Input value={value.caption ?? ""} onChange={(e) => setValue({ ...value, caption: e.target.value })} />
          </Field>
          <Field label="Alt Text (accessibility)">
            <Input
              value={value.altText ?? ""}
              onChange={(e) => setValue({ ...value, altText: e.target.value })}
            />
          </Field>
          <Field label="Category">
            <Select value={value.category ?? "Other"} onChange={(e) => setValue({ ...value, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Switch
            checked={value.visible ?? true}
            onChange={(v) => setValue({ ...value, visible: v })}
            label="Visible on public site"
          />
        </>
      )}
    />
  );
}
