import { MapPin } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import type { Experience, ContentMap } from "@/lib/types";

// دالة مساعدة آمنة لتحليل النص إلى مصفوفة
// (تدعم سواء JSON صحيح أو نص مفصول بفواصل)
function safeParseStringList(value?: string | null): string[] {
  if (!value) return [];
  
  // 1. محاولة التحليل كـ JSON
  try {
    return JSON.parse(value);
  } catch {
    // 2. إذا فشل، نتعامل معه كنص مفصول بفواصل (مثل: "Python, Java")
    return value.split(",").map((item) => item.trim());
  }
}

function formatDate(value: string | null) {
  if (!value) return "Present";
  const [year, month] = value.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ExperienceSection({
  experiences,
  content,
}: {
  experiences: Experience[];
  content: ContentMap;
}) {
  if (experiences.length === 0) return null;

  return (
    <section id="experience" className="border-b border-pub-border py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="03"
          eyebrow="EXPERIENCE"
          heading={content.heading || "Experience"}
          subheading={content.subheading}
        />

        <div className="relative mt-12 space-y-10 ps-8">
          <div className="absolute inset-y-0 start-[7px] w-px bg-pub-border" />
          {experiences.map((exp, i) => {
            // ✅ تم استبدال JSON.parse بدالة safeParseStringList الآمنة
            const tech = safeParseStringList(exp.technologies);
            const achievements = safeParseStringList(exp.achievements);
            
            return (
              <Reveal key={exp.id} delay={i * 0.08} className="relative">
                <div className="absolute -start-8 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-pub-accent bg-pub-bg" />
                <div className="rounded-2xl border border-pub-border bg-pub-surface/50 p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-pub-text">
                      {exp.position}
                    </h3>
                    <span className="font-mono text-xs text-pub-text-faint">
                      {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-pub-accent">
                    <span>{exp.company}</span>
                    {exp.location && (
                      <span className="flex items-center gap-1 text-pub-text-muted">
                        <MapPin size={12} /> {exp.location}
                      </span>
                    )}
                  </div>
                  {exp.description && (
                    <div
                      className="prose-content mt-3 text-sm text-pub-text-muted"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  )}
                  {achievements.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {achievements.map((a, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-pub-text-muted"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-pub-accent" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                  {tech.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-pub-border px-2.5 py-0.5 font-mono text-[11px] text-pub-text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}