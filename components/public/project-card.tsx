"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { GithubIcon } from "./brand-icons";
import { useI18n } from "@/lib/i18n/provider";
import type { Project } from "@/lib/types";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const { locale, dict } = useI18n();
  const tech: string[] = project.technologies ? JSON.parse(project.technologies) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 6) * 0.05 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-pub-border bg-pub-surface/50 transition-colors hover:border-pub-accent/50"
    >
      <Link href={`/${locale}/projects/${project.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-pub-surface-2">
          {project.mainImageUrl ? (
            <Image
              src={project.mainImageUrl}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-mono text-xs text-pub-text-faint">
              {dict.common.placeholder}
            </div>
          )}
          {project.featured && (
            <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-pub-accent px-2.5 py-1 font-mono text-[10px] font-semibold text-black">
              <Star size={10} fill="black" /> {dict.projects.featured}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5">
          <span className="font-mono text-[11px] uppercase tracking-widest text-pub-accent">
            {project.category}
          </span>
          <h3 className="mt-2 flex items-center gap-1.5 font-display text-lg font-semibold text-pub-text">
            {project.title}
            <ArrowUpRight
              size={16}
              className="text-pub-text-faint transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-pub-accent"
            />
          </h3>
          <p className="mt-2 flex-1 text-sm text-pub-text-muted line-clamp-2">
            {project.shortDescription}
          </p>
          {tech.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tech.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-pub-border-soft bg-pub-surface-2 px-2 py-0.5 font-mono text-[10px] text-pub-text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          {project.githubUrl && (
            <div className="mt-4 flex items-center gap-1.5 text-xs text-pub-text-faint">
              <GithubIcon size={12} /> {dict.projects.sourceCode}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
