"use client";

import { EntityManager } from "./ui/entity-manager";
import { Field, Input, Textarea, Switch } from "./ui/fields";
import { ImageUploader } from "./ui/image-uploader";
import { createAward, updateAward, deleteAward, reorderAwards } from "@/lib/actions/admin/awards";
import type { Award } from "@/lib/types";

export function AwardsManager({ items }: { items: Award[] }) {
  return (
    <EntityManager<Award>
      items={items}
      entityLabel="Award"
      actions={{ create: createAward, update: updateAward, remove: deleteAward, reorder: reorderAwards }}
      emptyDefaults={{
        title: "",
        description: "",
        date: "",
        icon: "award",
        organization: "",
        featured: false,
        order: items.length,
        visible: true,
      }}
      renderItem={(item) => ({ title: item.title, subtitle: item.organization ?? undefined })}
      renderForm={(value, setValue) => (
        <>
          <Field label="Title" required>
            <Input value={value.title ?? ""} onChange={(e) => setValue({ ...value, title: e.target.value })} />
          </Field>
          <Field label="Organization">
            <Input
              value={value.organization ?? ""}
              onChange={(e) => setValue({ ...value, organization: e.target.value })}
            />
          </Field>
          <Field label="Date">
            <Input
              type="date"
              value={value.date ?? ""}
              onChange={(e) => setValue({ ...value, date: e.target.value })}
            />
          </Field>
          <Field label="Icon (lucide name)">
            <Input value={value.icon ?? "award"} onChange={(e) => setValue({ ...value, icon: e.target.value })} />
          </Field>
          <Field label="Description">
            <Textarea
              rows={3}
              value={value.description ?? ""}
              onChange={(e) => setValue({ ...value, description: e.target.value })}
            />
          </Field>
          <Field label="Image">
            <ImageUploader
              value={value.imageUrl ?? ""}
              onChange={(url) => setValue({ ...value, imageUrl: url })}
              folder="other"
            />
          </Field>
          <Switch
            checked={value.featured ?? false}
            onChange={(v) => setValue({ ...value, featured: v })}
            label="Featured"
          />
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
