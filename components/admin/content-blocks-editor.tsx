"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Field, Input, Textarea, Button } from "./ui/fields";
import { updateContentBlock } from "@/lib/actions/admin/content";
import type { ContentBlock } from "@/lib/types";

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  about: "About",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  certificates: "Certificates",
  awards: "Awards",
  education: "Education",
  gallery: "Gallery",
  testimonials: "Testimonials",
  stats: "Statistics",
  contact: "Contact",
};

const MULTILINE_KEYS = new Set(["subheading", "body"]);

export function ContentBlocksEditor({ blocks }: { blocks: ContentBlock[] }) {
  const [locale, setLocale] = useState<"en" | "ar">("en");
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(blocks.map((b) => [`${b.section}.${b.key}.${b.locale}`, b.value]))
  );
  const [pending, startTransition] = useTransition();

  const sections = Array.from(new Set(blocks.map((b) => b.section)));

  function set(section: string, key: string, loc: string, value: string) {
    setValues((v) => ({ ...v, [`${section}.${key}.${loc}`]: value }));
  }

  function saveAll() {
    startTransition(async () => {
      const entries = Object.entries(values).filter(([k]) => k.endsWith(`.${locale}`));
      const results = await Promise.all(
        entries.map(([key, value]) => {
          const [section, blockKey] = key.split(".");
          return updateContentBlock(section, blockKey, locale, value);
        })
      );
      if (results.some((r) => !r.ok)) {
        toast.error("Some fields failed to save.");
        return;
      }
      toast.success("Changes saved.");
    });
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex gap-1 rounded-lg border border-adm-border bg-adm-surface-2 p-1">
          {(["en", "ar"] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                locale === l ? "bg-adm-surface shadow-sm text-adm-text" : "text-adm-text-muted"
              }`}
            >
              {l === "en" ? "English" : "العربية"}
            </button>
          ))}
        </div>
        <Button type="button" onClick={saveAll} disabled={pending}>
          <Save size={15} /> {pending ? "Saving..." : "Save All"}
        </Button>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          const keys = Array.from(
            new Set(blocks.filter((b) => b.section === section).map((b) => b.key))
          );
          return (
            <div key={section} className="rounded-2xl border border-adm-border bg-adm-surface p-5">
              <h3 className="mb-3 text-sm font-semibold text-adm-text">
                {SECTION_LABELS[section] ?? section}
              </h3>
              <div className="space-y-3">
                {keys.map((key) => {
                  const fieldKey = `${section}.${key}.${locale}`;
                  const value = values[fieldKey] ?? "";
                  const Multiline = MULTILINE_KEYS.has(key) ? Textarea : Input;
                  return (
                    <Field key={key} label={key}>
                      <Multiline
                        dir={locale === "ar" ? "rtl" : "ltr"}
                        value={value}
                        onChange={(e) => set(section, key, locale, e.target.value)}
                        {...(Multiline === Textarea ? { rows: 2 } : {})}
                      />
                    </Field>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
