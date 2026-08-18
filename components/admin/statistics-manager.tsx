"use client";

import { EntityManager } from "./ui/entity-manager";
import { Field, Input, Switch } from "./ui/fields";
import {
  createStatistic,
  updateStatistic,
  deleteStatistic,
  reorderStatistics,
} from "@/lib/actions/admin/statistics";
import type { Statistic } from "@/lib/types";

export function StatisticsManager({ items }: { items: Statistic[] }) {
  return (
    <EntityManager<Statistic>
      items={items}
      entityLabel="Statistic"
      actions={{
        create: createStatistic,
        update: updateStatistic,
        remove: deleteStatistic,
        reorder: reorderStatistics,
      }}
      emptyDefaults={{
        labelEn: "",
        labelAr: "",
        value: 0,
        suffix: "+",
        icon: "bar-chart",
        order: items.length,
        visible: true,
      }}
      renderItem={(item) => ({ title: `${item.value}${item.suffix ?? ""}`, subtitle: item.labelEn })}
      renderForm={(value, setValue) => (
        <>
          <div className="grid grid-cols-2 gap-3">
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
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Value" required>
              <Input
                type="number"
                value={value.value ?? 0}
                onChange={(e) => setValue({ ...value, value: Number(e.target.value) })}
              />
            </Field>
            <Field label="Suffix" hint="e.g. + or %">
              <Input value={value.suffix ?? ""} onChange={(e) => setValue({ ...value, suffix: e.target.value })} />
            </Field>
          </div>
          <Field label="Icon (lucide name)">
            <Input value={value.icon ?? "bar-chart"} onChange={(e) => setValue({ ...value, icon: e.target.value })} />
          </Field>
          <Switch checked={value.visible ?? true} onChange={(v) => setValue({ ...value, visible: v })} label="Visible" />
        </>
      )}
    />
  );
}
