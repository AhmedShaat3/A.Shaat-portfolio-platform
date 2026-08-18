import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/public/brand-icons";
import { resolveLocale } from "@/lib/i18n/params";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getProjectBySlug } from "@/lib/data/public";
import { recordProjectView } from "@/lib/data/analytics";
import { Reveal } from "@/components/public/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.shortDescription || undefined,
    openGraph: project.mainImageUrl ? { images: [project.mainImageUrl] } : undefined,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = getDictionary(locale);
  const project = await getProjectBySlug(slug);

  if (!project) notFound();
  recordProjectView(project.id);

  const technologies: string[] = project.technologies
    ? JSON.parse(project.technologies)
    : [];
  const stats: Array<{ label: string; value: string }> = project.stats
    ? JSON.parse(project.stats)
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.shortDescription,
    ...(project.mainImageUrl ? { image: project.mainImageUrl } : {}),
  };

  return (
    <article className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href={`/${locale}/projects`}
        className="inline-flex items-center gap-1.5 font-mono text-sm text-pub-text-muted hover:text-pub-accent"
      >
        <ArrowLeft size={14} /> {dict.projects.backToProjects}
      </Link>

      <Reveal delay={0.05}>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-pub-accent/40 bg-pub-accent/10 px-3 py-1 font-mono text-xs text-pub-accent">
            {project.category}
          </span>
          <span className="rounded-full border border-pub-border px-3 py-1 font-mono text-xs text-pub-text-muted">
            {dict.projects.status[project.status as keyof typeof dict.projects.status] ??
              project.status}
          </span>
        </div>

        <h1 className="mt-4 font-display text-3xl font-bold text-pub-text sm:text-5xl">
          {project.title}
        </h1>
        {project.shortDescription && (
          <p className="mt-4 max-w-2xl text-lg text-pub-text-muted">
            {project.shortDescription}
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-pub-accent px-5 py-2.5 text-sm font-semibold text-black"
            >
              <ExternalLink size={15} /> {dict.projects.liveDemo}
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-pub-border px-5 py-2.5 text-sm font-semibold text-pub-text hover:border-pub-accent"
            >
              <GithubIcon size={15} /> {dict.projects.sourceCode}
            </a>
          )}
        </div>
      </Reveal>

      {project.mainImageUrl && (
        <Reveal delay={0.1}>
          <div className="relative mt-10 aspect-video w-full overflow-hidden rounded-2xl border border-pub-border bg-pub-surface-2">
            <Image src={project.mainImageUrl} alt={project.title} fill className="object-cover" />
          </div>
        </Reveal>
      )}

      {stats.length > 0 && (
        <Reveal delay={0.12}>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s, i) => (
              <div key={i} className="rounded-xl border border-pub-border bg-pub-surface/50 p-4 text-center">
                <p className="font-display text-2xl font-bold text-pub-accent">{s.value}</p>
                <p className="mt-1 text-xs text-pub-text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {project.fullDescription && (
        <Reveal delay={0.15}>
          <div
            className="prose-content mt-10 text-pub-text-muted"
            dangerouslySetInnerHTML={{ __html: project.fullDescription }}
          />
        </Reveal>
      )}

      {technologies.length > 0 && (
        <Reveal delay={0.18}>
          <div className="mt-8">
            <p className="font-mono text-xs uppercase tracking-widest text-pub-text-faint">
              {dict.projects.technologies}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-pub-border bg-pub-surface-2 px-2.5 py-1 font-mono text-xs text-pub-text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {[
        { label: dict.projects.challenge, value: project.challenges },
        { label: dict.projects.solution, value: project.solution },
        { label: dict.projects.results, value: project.results },
      ]
        .filter((b) => b.value)
        .map((block, i) => (
          <Reveal key={block.label} delay={0.2 + i * 0.05}>
            <div className="mt-8 rounded-2xl border border-pub-border bg-pub-surface/50 p-6">
              <h2 className="font-display text-lg font-semibold text-pub-text">
                {block.label}
              </h2>
              <div
                className="prose-content mt-2 text-sm text-pub-text-muted"
                dangerouslySetInnerHTML={{ __html: block.value || "" }}
              />
            </div>
          </Reveal>
        ))}

      {project.images.length > 0 && (
        <Reveal delay={0.3}>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {project.images.map((img) => (
              <div
                key={img.id}
                className="relative aspect-video overflow-hidden rounded-xl border border-pub-border bg-pub-surface-2"
              >
                <Image
                  src={img.url}
                  alt={img.altText || project.title}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Reveal>
      )}
    </article>
  );
}
