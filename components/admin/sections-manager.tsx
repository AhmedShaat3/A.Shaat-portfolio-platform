"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Eye, EyeOff, GripVertical } from "lucide-react";
import { Card } from "./ui/card";
import { reorderSections, toggleSectionVisibility } from "@/lib/actions/admin/sections";
import type { Section } from "@/lib/types";

export function SectionsManager({ items }: { items: Section[] }) {
  const [list, setList] = useState(items);
  const [, startTransition] = useTransition();

  function move(index: number, direction: -1 | 1) {
    const next = [...list];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setList(next);
    startTransition(async () => {
      const result = await reorderSections(next.map((i) => i.id));
      if (!result.ok) toast.error(result.error || "Reorder failed.");
    });
  }

  function toggle(section: Section) {
    setList((l) => l.map((s) => (s.id === section.id ? { ...s, visible: !s.visible } : s)));
    startTransition(async () => {
      const result = await toggleSectionVisibility(section.id, !section.visible);
      if (!result.ok) toast.error(result.error || "Update failed.");
      else toast.success("Changes saved.");
    });
  }

  return (
    <div>
      <p className="mb-4 text-sm text-adm-text-muted">
        Control which sections appear on the public homepage, and in what order. The
        hero section always appears first.
      </p>
      <div className="space-y-2">
        {list.map((section, index) => (
          <Card key={section.id} className="flex items-center gap-3 p-3">
            <GripVertical size={16} className="text-adm-text-muted" />
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="flex h-6 w-6 items-center justify-center rounded text-adm-text-muted hover:bg-adm-surface-2 disabled:opacity-30"
                aria-label="Move up"
              >
                <ArrowUp size={13} />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === list.length - 1}
                className="flex h-6 w-6 items-center justify-center rounded text-adm-text-muted hover:bg-adm-surface-2 disabled:opacity-30"
                aria-label="Move down"
              >
                <ArrowDown size={13} />
              </button>
            </div>
            <p className="flex-1 text-sm font-medium text-adm-text">{section.labelEn}</p>
            <button
              type="button"
              onClick={() => toggle(section)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                section.visible ? "bg-emerald-50 text-adm-success" : "bg-gray-100 text-adm-text-muted"
              }`}
            >
              {section.visible ? <Eye size={12} /> : <EyeOff size={12} />}
              {section.visible ? "Visible" : "Hidden"}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
