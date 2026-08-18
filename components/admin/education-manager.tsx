"use client";

import { EntityManager } from "./ui/entity-manager";
import { Field, Input, Textarea, Switch } from "./ui/fields";
import { TagListEditor } from "./ui/tag-list-editor";
import { ImageUploader } from "./ui/image-uploader";
import {
  createEducation,
  updateEducation,
  deleteEducation,
  reorderEducation,
} from "@/lib/actions/admin/education";
import type { Education } from "@/lib/types";

type FormShape = Omit<Education, "coursework"> & { coursework: string[] | string };

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

export function EducationManager({ items }: { items: Education[] }) {
  return (
    <EntityManager<FormShape>
      items={items.map((i) => ({ ...i, coursework: parseArr(i.coursework) }))}
      entityLabel="Education"
      actions={{
        create: createEducation,
        update: updateEducation,
        remove: deleteEducation,
        reorder: reorderEducation,
      }}
      toRow={(v) => ({ ...v, coursework: parseArr(v.coursework) })}
      emptyDefaults={{
        university: "",
        degree: "",
        major: "",
        gpa: "",
        startYear: "",
        endYear: "",
        coursework: [],
        description: "",
        order: items.length,
        visible: true,
      }}
      renderItem={(item) => ({ title: item.university, subtitle: item.degree })}
      renderForm={(value, setValue) => (
        <>
          <Field label="University" required>
            <Input
              value={value.university ?? ""}
              onChange={(e) => setValue({ ...value, university: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Degree" required>
              <Input value={value.degree ?? ""} onChange={(e) => setValue({ ...value, degree: e.target.value })} />
            </Field>
            <Field label="Major">
              <Input value={value.major ?? ""} onChange={(e) => setValue({ ...value, major: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Start Year" required>
              <Input value={value.startYear ?? ""} onChange={(e) => setValue({ ...value, startYear: e.target.value })} />
            </Field>
            <Field label="End Year">
              <Input value={value.endYear ?? ""} onChange={(e) => setValue({ ...value, endYear: e.target.value })} />
            </Field>
            <Field label="GPA">
              <Input value={value.gpa ?? ""} onChange={(e) => setValue({ ...value, gpa: e.target.value })} />
            </Field>
          </div>
          <Field label="University Logo">
            <ImageUploader
              value={value.logoUrl ?? ""}
              onChange={(url) => setValue({ ...value, logoUrl: url })}
              folder="logos"
            />
          </Field>
          <Field label="Description">
            <Textarea
              rows={3}
              value={value.description ?? ""}
              onChange={(e) => setValue({ ...value, description: e.target.value })}
            />
          </Field>
          <Field label="Relevant Coursework">
            <TagListEditor
              values={parseArr(value.coursework)}
              onChange={(v) => setValue({ ...value, coursework: v })}
              placeholder="Add course and press Enter"
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
