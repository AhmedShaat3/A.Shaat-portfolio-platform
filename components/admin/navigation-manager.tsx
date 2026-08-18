"use client";

import { EntityManager } from "./ui/entity-manager";
import { Field, Input, Switch } from "./ui/fields";
import {
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  reorderNavigationItems,
} from "@/lib/actions/admin/navigation";
import type { NavigationItem } from "@/lib/types";

export function NavigationManager({ items }: { items: NavigationItem[] }) {
  return (
    <EntityManager<NavigationItem>
      items={items}
      entityLabel="Nav Item"
      actions={{
        create: createNavigationItem,
        update: updateNavigationItem,
        remove: deleteNavigationItem,
        reorder: reorderNavigationItems,
      }}
      emptyDefaults={{
        labelEn: "",
        labelAr: "",
        url: "#",
        order: items.length,
        visible: true,
        openInNewTab: false,
      }}
      renderItem={(item) => ({ title: item.labelEn, subtitle: item.url })}
      renderForm={(value, setValue) => (
        <>
          <Field label="Label (English)" required>
            <Input value={value.labelEn ?? ""} onChange={(e) => setValue({ ...value, labelEn: e.target.value })} />
          </Field>
          <Field label="Label (Arabic)">
            <Input
              dir="rtl"
              value={value.labelAr ?? ""}
              onChange={(e) => setValue({ ...value, labelAr: e.target.value })}
            />
          </Field>
          <Field label="URL" hint="Use #section-id for in-page sections, or a full path/URL." required>
            <Input value={value.url ?? ""} onChange={(e) => setValue({ ...value, url: e.target.value })} />
          </Field>
          <Switch
            checked={value.openInNewTab ?? false}
            onChange={(v) => setValue({ ...value, openInNewTab: v })}
            label="Open in new tab"
          />
          <Switch
            checked={value.visible ?? true}
            onChange={(v) => setValue({ ...value, visible: v })}
            label="Visible"
          />
        </>
      )}
    />
  );
}
