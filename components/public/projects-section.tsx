import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { ProjectCard } from "./project-card";
import { Reveal } from "./reveal";
import type { Project, ContentMap } from "@/lib/types";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export function ProjectsSection({
  projects,
  content,
  locale,
}: {
  projects: Project[];
  content: ContentMap;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="border-b border-pub-border py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            index="04"
            eyebrow="PROJECTS"
            heading={content.heading || "Featured Projects"}
            subheading={content.subheading}
          />
          <Reveal delay={0.15}>
            <Link
              href={`/${locale}/projects`}
              className="flex items-center gap-1.5 font-mono text-sm text-pub-accent hover:underline"
            >
              {dict.sections.projectsAll} <ArrowRight size={14} />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
