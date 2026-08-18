"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Field, Input, Textarea, Button } from "./ui/fields";
import { ImageUploader } from "./ui/image-uploader";
import { updateSiteSettings, updateSiteAssets } from "@/lib/actions/admin/content";
import type { SiteSettings } from "@/lib/types";

export function SeoEditor({ settings }: { settings: SiteSettings | null }) {
  const [form, setForm] = useState({
    siteTitle: settings?.siteTitle ?? "",
    siteDescription: settings?.siteDescription ?? "",
    keywords: settings?.keywords ?? "",
    author: settings?.author ?? "",
    canonicalUrl: settings?.canonicalUrl ?? "",
  });
  const [ogImageUrl, setOgImageUrl] = useState(settings?.ogImageUrl ?? "");
  const [pending, startTransition] = useTransition();

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function save() {
    startTransition(async () => {
      const [r1, r2] = await Promise.all([
        updateSiteSettings({
          ...form,
          primaryColor: settings?.primaryColor ?? "#29d8f0",
          logoText: settings?.logoText ?? "",
        }),
        updateSiteAssets({ ogImageUrl }),
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
      <Field label="Site Title" required>
        <Input value={form.siteTitle} onChange={(e) => set("siteTitle", e.target.value)} />
      </Field>
      <Field label="Site Description">
        <Textarea rows={3} value={form.siteDescription} onChange={(e) => set("siteDescription", e.target.value)} />
      </Field>
      <Field label="Keywords" hint="Comma separated">
        <Input value={form.keywords} onChange={(e) => set("keywords", e.target.value)} />
      </Field>
      <Field label="Author">
        <Input value={form.author} onChange={(e) => set("author", e.target.value)} />
      </Field>
      <Field label="Canonical URL" hint="Your production domain, e.g. https://yourname.com">
        <Input value={form.canonicalUrl} onChange={(e) => set("canonicalUrl", e.target.value)} />
      </Field>
      <Field label="Open Graph / Social Preview Image">
        <ImageUploader value={ogImageUrl} onChange={setOgImageUrl} folder="other" />
      </Field>

      <Button type="button" onClick={save} disabled={pending}>
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
