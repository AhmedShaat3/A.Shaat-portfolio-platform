"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Field, Input, Button } from "./ui/fields";
import { ImageUploader } from "./ui/image-uploader";
import { updateSiteSettings, updateSiteAssets } from "@/lib/actions/admin/content";
import type { SiteSettings } from "@/lib/types";

const PRESET_COLORS = ["#29d8f0", "#4f8cf7", "#4ade80", "#f472b6", "#facc15", "#a78bfa"];

export function AppearanceEditor({ settings }: { settings: SiteSettings | null }) {
  const [logoText, setLogoText] = useState(settings?.logoText ?? "");
  const [primaryColor, setPrimaryColor] = useState(settings?.primaryColor ?? "#29d8f0");
  const [faviconUrl, setFaviconUrl] = useState(settings?.faviconUrl ?? "");
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const [r1, r2] = await Promise.all([
        updateSiteSettings({
          siteTitle: settings?.siteTitle ?? "Portfolio",
          siteDescription: settings?.siteDescription ?? "",
          keywords: settings?.keywords ?? "",
          author: settings?.author ?? "",
          canonicalUrl: settings?.canonicalUrl ?? "",
          primaryColor,
          logoText,
        }),
        updateSiteAssets({ faviconUrl }),
      ]);
      if (!r1.ok) {
        toast.error(r1.error);
        return;
      }
      if (!r2.ok) {
        toast.error(r2.error);
        return;
      }
      toast.success("Changes saved.");
    });
  }

  return (
    <div className="max-w-xl space-y-5">
      <Field label="Logo Text" hint="Shown in the header and footer">
        <Input value={logoText} onChange={(e) => setLogoText(e.target.value)} />
      </Field>

      <Field label="Primary Accent Color">
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setPrimaryColor(c)}
              aria-label={c}
              className={`h-8 w-8 rounded-full border-2 ${
                primaryColor === c ? "border-adm-text" : "border-transparent"
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded-full border border-adm-border"
          />
        </div>
        <p className="mt-2 text-xs text-adm-text-muted">
          Note: this stores your chosen accent color; wiring it fully into the live
          Tailwind theme requires editing the CSS variable in{" "}
          <code>app/globals.css</code> (documented in SETUP.md) since Tailwind v4
          themes are resolved at build time, not runtime.
        </p>
      </Field>

      <Field label="Favicon">
        <ImageUploader value={faviconUrl} onChange={setFaviconUrl} folder="logos" />
      </Field>

      <Button type="button" onClick={save} disabled={pending}>
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
