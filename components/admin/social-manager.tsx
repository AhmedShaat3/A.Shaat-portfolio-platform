"use client";

import { EntityManager } from "./ui/entity-manager";
import { Field, Input, Select, Switch } from "./ui/fields";
import {
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  reorderSocialLinks,
} from "@/lib/actions/admin/social";
import type { SocialLink } from "@/lib/types";

const PLATFORMS = ["github", "linkedin", "twitter", "email"];

export function SocialLinksManager({ items }: { items: SocialLink[] }) {
  return (
    <EntityManager<SocialLink>
      items={items}
      entityLabel="Social Link"
      actions={{
        create: createSocialLink,
        update: updateSocialLink,
        remove: deleteSocialLink,
        reorder: reorderSocialLinks,
      }}
      emptyDefaults={{ platform: "github", url: "", icon: "github", order: items.length, visible: true }}
      renderItem={(item) => ({ title: item.platform, subtitle: item.url })}
      renderForm={(value, setValue) => (
        <>
          <Field label="Platform" required>
            <Select
              value={value.platform ?? "github"}
              onChange={(e) => setValue({ ...value, platform: e.target.value, icon: e.target.value })}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="URL" required>
            <Input value={value.url ?? ""} onChange={(e) => setValue({ ...value, url: e.target.value })} />
          </Field>
          <Switch checked={value.visible ?? true} onChange={(v) => setValue({ ...value, visible: v })} label="Visible" />
        </>
      )}
    />
  );
}
