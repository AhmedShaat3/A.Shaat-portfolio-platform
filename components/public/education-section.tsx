import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { GraduationCap } from "lucide-react";
import type { Education, ContentMap } from "@/lib/types";

export function EducationSection({
  education,
  content,
}: {
  education: Education[];
  content: ContentMap;
}) {
  if (education.length === 0) return null;

  return (
    <section id="education" className="border-b border-pub-border py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="07"
          eyebrow="EDUCATION"
          heading={content.heading || "Education"}
          subheading={content.subheading}
        />

        <div className="mt-12 space-y-6">
          {education.map((ed, i) => {
            const coursework: string[] = ed.coursework ? JSON.parse(ed.coursework) : [];
            return (
              <Reveal key={ed.id} delay={i * 0.08}>
                <div className="flex flex-col gap-4 rounded-2xl border border-pub-border bg-pub-surface/50 p-6 sm:flex-row sm:items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-pub-accent/30 bg-pub-accent/10 text-pub-accent">
                    <GraduationCap size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold text-pub-text">
                        {ed.university}
                      </h3>
                      <span className="font-mono text-xs text-pub-text-faint">
                        {ed.startYear} — {ed.endYear || "Present"}
                      </span>
                    </div>
                    <p className="mt-1 text-pub-accent">
                      {ed.degree}
                      {ed.major ? ` · ${ed.major}` : ""}
                    </p>
                    {ed.gpa && (
                      <p className="mt-1 text-sm text-pub-text-muted">GPA: {ed.gpa}</p>
                    )}
                    {ed.description && (
                      <p className="mt-2 text-sm text-pub-text-muted">{ed.description}</p>
                    )}
                    {coursework.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {coursework.map((c) => (
                          <span
                            key={c}
                            className="rounded-md border border-pub-border-soft bg-pub-surface-2 px-2 py-0.5 font-mono text-[11px] text-pub-text-muted"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
