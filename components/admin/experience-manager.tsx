"use client";

import { EntityManager } from "./ui/entity-manager";
import { Field, Input, Switch } from "./ui/fields";
import { RichTextEditor } from "./ui/rich-text-editor";
import { TagListEditor } from "./ui/tag-list-editor";
import { ImageUploader } from "./ui/image-uploader";
import {
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
} from "@/lib/actions/admin/experience";
import type { Experience } from "@/lib/types";

type FormShape = Omit<Experience, "technologies" | "achievements"> & {
  technologies: string[] | string;
  achievements: string[] | string;
};

function parseArr(v: string[] | string | undefined): string[] {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    try {
      return JSON.parse(v || "[]");
    } catch {
      return [];
    }
  }
  return [];
}

export function ExperienceManager({ items }: { items: Experience[] }) {
  return (
    <EntityManager<FormShape>
      items={items.map((i) => ({
        ...i,
        technologies: parseArr(i.technologies),
        achievements: parseArr(i.achievements),
      }))}
      entityLabel="Experience"
      actions={{
        create: createExperience,
        update: updateExperience,
        remove: deleteExperience,
        reorder: reorderExperiences,
      }}
      toRow={(v) => ({
        ...v,
        technologies: parseArr(v.technologies),
        achievements: parseArr(v.achievements),
      })}
      emptyDefaults={{
        company: "",
        position: "",
        description: "",
        startDate: "",
        endDate: "",
        technologies: [],
        achievements: [],
        location: "",
        order: items.length,
        visible: true,
      }}
      renderItem={(item) => ({ title: item.position, subtitle: item.company })}
      renderForm={(value, setValue) => (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company" required>
              <Input value={value.company ?? ""} onChange={(e) => setValue({ ...value, company: e.target.value })} />
            </Field>
            <Field label="Position" required>
              <Input value={value.position ?? ""} onChange={(e) => setValue({ ...value, position: e.target.value })} />
            </Field>
          </div>
          <Field label="Company Logo">
            <ImageUploader
              value={value.logoUrl ?? ""}
              onChange={(url) => setValue({ ...value, logoUrl: url })}
              folder="logos"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start Date" hint="YYYY-MM" required>
              <Input
                placeholder="2025-01"
                value={value.startDate ?? ""}
                onChange={(e) => setValue({ ...value, startDate: e.target.value })}
              />
            </Field>
            <Field label="End Date" hint="Leave blank for Present">
              <Input
                placeholder="2025-06"
                value={value.endDate ?? ""}
                onChange={(e) => setValue({ ...value, endDate: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Location">
            <Input value={value.location ?? ""} onChange={(e) => setValue({ ...value, location: e.target.value })} />
          </Field>
          <Field label="Description">
            <RichTextEditor
              value={value.description ?? ""}
              onChange={(html) => setValue({ ...value, description: html })}
            />
          </Field>
          <Field label="Technologies">
            <TagListEditor
              values={parseArr(value.technologies)}
              onChange={(v) => setValue({ ...value, technologies: v })}
            />
          </Field>
          <Field label="Achievements">
            <TagListEditor
              values={parseArr(value.achievements)}
              onChange={(v) => setValue({ ...value, achievements: v })}
              placeholder="Add achievement and press Enter"
            />
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
