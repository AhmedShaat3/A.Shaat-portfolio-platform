import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n/params";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getPublishedProjects, getSiteSettings } from "@/lib/data/public";
import { getSectionContent } from "@/lib/data/content";
import { ProjectsBrowser } from "@/components/public/projects-browser";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = getDictionary(locale);
  return { title: dict.sections.projectsAll };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = getDictionary(locale);

  const [projects, content] = await Promise.all([
    getPublishedProjects(),
    getSectionContent("projects", locale),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-pub-accent">
          PROJECTS
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-pub-text sm:text-4xl">
          {dict.sections.projectsAll}
        </h1>
        {content.subheading && (
          <p className="mt-3 max-w-2xl text-pub-text-muted">{content.subheading}</p>
        )}
      </div>
      <ProjectsBrowser projects={projects} />
    </div>
  );
}
