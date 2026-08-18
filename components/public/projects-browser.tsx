"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { ProjectCard } from "@/components/public/project-card";
import { useI18n } from "@/lib/i18n/provider";
import type { Project } from "@/lib/types";

export function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const { dict } = useI18n();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects]
  );

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = category === "all" || p.category === category;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.shortDescription ?? "").toLowerCase().includes(q) ||
        (JSON.parse(p.technologies || "[]") as string[]).some((t) =>
          t.toLowerCase().includes(q)
        );
      return matchesCategory && matchesQuery;
    });
  }, [projects, query, category]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-pub-text-faint"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.projects.searchPlaceholder}
            className="w-full rounded-full border border-pub-border bg-pub-surface-2 py-2.5 pl-9 pr-4 text-sm text-pub-text outline-none focus:border-pub-accent"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                category === cat
                  ? "border-pub-accent bg-pub-accent text-black"
                  : "border-pub-border text-pub-text-muted hover:border-pub-accent hover:text-pub-accent"
              }`}
            >
              {cat === "all" ? dict.projects.allCategories : cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-pub-text-muted">{dict.projects.noResults}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
