"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { resolveIcon } from "@/lib/utils/icons";
import type { Skill, ContentMap } from "@/lib/types";

export function Skills({
  skills,
  content,
}: {
  skills: Skill[];
  content: ContentMap;
}) {
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="border-b border-pub-border py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="02"
          eyebrow="SKILLS"
          heading={content.heading || "Skills & Expertise"}
          subheading={content.subheading}
        />

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, ci) => (
            <Reveal key={category} delay={ci * 0.06}>
              <div className="h-full rounded-2xl border border-pub-border bg-pub-surface/50 p-6">
                <h3 className="font-display text-lg font-semibold text-pub-text">
                  {category}
                </h3>
                <div className="mt-5 space-y-4">
                  {skills
                    .filter((s) => s.category === category)
                    .map((skill) => {
                      const Icon = resolveIcon(skill.icon);
                      return (
                        <div key={skill.id}>
                          <div className="mb-1.5 flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-pub-text">
                              <Icon size={14} className="text-pub-accent" />
                              {skill.name}
                            </span>
                            <span className="font-mono text-xs text-pub-text-faint">
                              {skill.proficiency}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-pub-surface-2">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.proficiency}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.9, ease: "easeOut" }}
                              className="h-full rounded-full bg-gradient-to-r from-pub-accent to-pub-accent-2"
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
