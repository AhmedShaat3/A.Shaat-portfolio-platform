import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import type { Profile, ContentMap } from "@/lib/types";

export function About({
  profile,
  content,
}: {
  profile: Profile | null;
  content: ContentMap;
}) {
  const values: string[] = profile?.values ? JSON.parse(profile.values) : [];

  return (
    <section id="about" className="border-b border-pub-border py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="01"
          eyebrow="ABOUT"
          heading={content.heading || "About Me"}
          subheading={content.subheading}
        />

        <div className="mt-12 grid gap-12 lg:grid-cols-5">
          <Reveal delay={0.1} className="lg:col-span-3">
            <div
              className="prose-content text-pub-text-muted"
              dangerouslySetInnerHTML={{
                __html: profile?.bio || "<p>Add your biography from the admin dashboard.</p>",
              }}
            />
            {profile?.mission && (
              <div className="mt-8 rounded-xl border border-pub-border bg-pub-surface/60 p-5">
                <p className="font-mono text-xs uppercase tracking-widest text-pub-accent">
                  Mission
                </p>
                <p className="mt-2 text-pub-text">{profile.mission}</p>
              </div>
            )}
          </Reveal>

          <Reveal delay={0.2} className="lg:col-span-2">
            <div className="rounded-2xl border border-pub-border bg-pub-surface/50 p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-pub-text-muted">
                Values
              </p>
              <ul className="mt-4 space-y-3">
                {values.map((v, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-pub-text">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pub-accent" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
