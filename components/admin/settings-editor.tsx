"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Rocket, Globe } from "lucide-react";
import { Card } from "./ui/card";
import { Button, Select, Switch } from "./ui/fields";
import { publishSite } from "@/lib/actions/admin/content";
import type { SiteSettings } from "@/lib/types";

export function SettingsEditor({ settings }: { settings: SiteSettings | null }) {
  const [pending, startTransition] = useTransition();
  const [defaultLocale, setDefaultLocale] = useState(settings?.defaultLocale ?? "en");
  const [maintenanceMode, setMaintenanceMode] = useState(settings?.maintenanceMode ?? false);

  function handlePublish() {
    startTransition(async () => {
      const result = await publishSite();
      if (!result.ok) {
        toast.error(result.error || "Publish failed.");
        return;
      }
      toast.success("Portfolio published successfully.");
    });
  }

  return (
    <div className="max-w-xl space-y-6">
      <Card>
        <div className="flex items-center gap-2 text-sm font-semibold text-adm-text">
          <Rocket size={16} className="text-adm-accent" /> Publishing
        </div>
        <p className="mt-2 text-sm text-adm-text-muted">
          Current published version:{" "}
          <span className="font-mono text-adm-text">{settings?.publishedVersion ?? "1.0"}</span>
          {settings?.lastPublishedAt && (
            <> · last published {new Date(settings.lastPublishedAt).toLocaleString()}</>
          )}
        </p>
        <p className="mt-2 text-xs text-adm-text-muted">
          Most content changes go live immediately once saved. This button records a
          new published version number and timestamp for your own tracking — useful
          as a lightweight release marker.
        </p>
        <Button type="button" onClick={handlePublish} disabled={pending} className="mt-4">
          {pending ? "Publishing..." : "Publish New Version"}
        </Button>
      </Card>

      <Card>
        <div className="flex items-center gap-2 text-sm font-semibold text-adm-text">
          <Globe size={16} className="text-adm-accent" /> Localization
        </div>
        <div className="mt-3">
          <Select
            value={defaultLocale}
            onChange={(e) => setDefaultLocale(e.target.value)}
            disabled
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </Select>
          <p className="mt-2 text-xs text-adm-text-muted">
            The default locale is currently fixed to English at the routing level
            (root path redirects to /en). Changing this requires updating the
            redirect logic in <code>proxy.ts</code> — see SETUP.md.
          </p>
        </div>
      </Card>

      <Card>
        <div className="mb-1 text-sm font-semibold text-adm-text">Maintenance Mode</div>
        <p className="mb-3 text-sm text-adm-text-muted">
          Architecture only in this build — the flag is stored, but the public site
          does not yet check it before rendering. Wiring it up is a small addition to{" "}
          <code>app/[locale]/layout.tsx</code>.
        </p>
        <Switch checked={maintenanceMode} onChange={setMaintenanceMode} label="Enable maintenance mode" />
      </Card>
    </div>
  );
}
