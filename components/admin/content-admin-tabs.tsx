"use client";

import { useState } from "react";
import { ProfileEditor } from "./profile-editor";
import { ContentBlocksEditor } from "./content-blocks-editor";
import { StatisticsManager } from "./statistics-manager";
import { SocialLinksManager } from "./social-manager";
import type { Profile, ContentBlock, Statistic, SocialLink } from "@/lib/types";

const TABS = [
  { id: "profile", label: "Profile & Hero" },
  { id: "text", label: "Section Text" },
  { id: "stats", label: "Statistics" },
  { id: "social", label: "Social Links" },
] as const;

export function ContentAdminTabs({
  profile,
  blocks,
  stats,
  social,
}: {
  profile: Profile | null;
  blocks: ContentBlock[];
  stats: Statistic[];
  social: SocialLink[];
}) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("profile");

  return (
    <div>
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg border border-adm-border bg-adm-surface-2 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-medium ${
              tab === t.id ? "bg-adm-surface shadow-sm text-adm-text" : "text-adm-text-muted"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "profile" && <ProfileEditor profile={profile} />}
      {tab === "text" && <ContentBlocksEditor blocks={blocks} />}
      {tab === "stats" && <StatisticsManager items={stats} />}
      {tab === "social" && <SocialLinksManager items={social} />}
    </div>
  );
}
