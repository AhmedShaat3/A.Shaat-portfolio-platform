"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

export function TagListEditor({
  values,
  onChange,
  placeholder = "Add item and press Enter",
}: {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const v = draft.trim();
    if (!v) return;
    onChange([...values, v]);
    setDraft("");
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="w-full rounded-lg border border-adm-border bg-adm-surface-2 px-3 py-2 text-sm outline-none focus:border-adm-accent"
        />
        <button
          type="button"
          onClick={add}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-adm-border text-adm-text-muted hover:bg-adm-surface-2"
          aria-label="Add"
        >
          <Plus size={16} />
        </button>
      </div>
      {values.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {values.map((v, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 rounded-full border border-adm-border bg-adm-surface-2 px-2.5 py-1 text-xs text-adm-text"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(values.filter((_, idx) => idx !== i))}
                aria-label={`Remove ${v}`}
                className="text-adm-text-muted hover:text-adm-danger"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
