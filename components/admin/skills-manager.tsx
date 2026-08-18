"use client";

import { EntityManager } from "./ui/entity-manager";
import { Field, Input, Textarea, Select, Switch } from "./ui/fields";
import { createSkill, updateSkill, deleteSkill, reorderSkills } from "@/lib/actions/admin/skills";
import type { Skill } from "@/lib/types";

const CATEGORIES = [
  "Cybersecurity",
  "Artificial Intelligence",
  "Software Engineering",
  "Cloud",
  "DevOps",
  "Networking",
  "Data",
  "Web Development",
];

export function SkillsManager({ items }: { items: Skill[] }) {
  return (
    <EntityManager<Skill>
      items={items}
      entityLabel="Skill"
      actions={{ create: createSkill, update: updateSkill, remove: deleteSkill, reorder: reorderSkills }}
      emptyDefaults={{
        name: "",
        icon: "code",
        category: CATEGORIES[0],
        proficiency: 70,
        description: "",
        order: items.length,
        visible: true,
      }}
      renderItem={(item) => ({ title: item.name, subtitle: `${item.category} · ${item.proficiency}%` })}
      renderForm={(value, setValue) => (
        <>
          <Field label="Name" required>
            <Input
              value={value.name ?? ""}
              onChange={(e) => setValue({ ...value, name: e.target.value })}
            />
          </Field>
          <Field label="Category" required>
            <Select
              value={value.category ?? CATEGORIES[0]}
              onChange={(e) => setValue({ ...value, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Icon (lucide name, e.g. shield, code, cloud)">
            <Input
              value={value.icon ?? "code"}
              onChange={(e) => setValue({ ...value, icon: e.target.value })}
            />
          </Field>
          <Field label={`Proficiency: ${value.proficiency ?? 70}%`}>
            <input
              type="range"
              min={0}
              max={100}
              value={value.proficiency ?? 70}
              onChange={(e) => setValue({ ...value, proficiency: Number(e.target.value) })}
              className="w-full accent-adm-accent"
            />
          </Field>
          <Field label="Description">
            <Textarea
              rows={2}
              value={value.description ?? ""}
              onChange={(e) => setValue({ ...value, description: e.target.value })}
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
