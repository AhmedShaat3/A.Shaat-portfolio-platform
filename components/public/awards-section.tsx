import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { resolveIcon } from "@/lib/utils/icons";
import type { Award, ContentMap } from "@/lib/types";

export function AwardsSection({
  awards,
  content,
}: {
  awards: Award[];
  content: ContentMap;
}) {
  if (awards.length === 0) return null;

  return (
    <section id="awards" className="border-b border-pub-border py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="06"
          eyebrow="AWARDS"
          heading={content.heading || "Awards & Achievements"}
          subheading={content.subheading}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {awards.map((award, i) => {
            const Icon = resolveIcon(award.icon);
            return (
              <Reveal key={award.id} delay={(i % 6) * 0.06}>
                <div className="flex h-full gap-4 rounded-2xl border border-pub-border bg-pub-surface/50 p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-pub-accent/30 bg-pub-accent/10 text-pub-accent">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-pub-text">
                      {award.title}
                    </h3>
                    {award.organization && (
                      <p className="text-sm text-pub-accent">{award.organization}</p>
                    )}
                    {award.description && (
                      <p className="mt-1 text-sm text-pub-text-muted">
                        {award.description}
                      </p>
                    )}
                    {award.date && (
                      <p className="mt-2 font-mono text-xs text-pub-text-faint">
                        {award.date}
                      </p>
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
