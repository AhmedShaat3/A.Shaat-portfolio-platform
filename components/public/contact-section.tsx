"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Send, Mail, Phone, MapPin } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { useI18n } from "@/lib/i18n/provider";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact";
import type { Profile, ContentMap } from "@/lib/types";

const initialState: ContactFormState = { ok: false };

export function ContactSection({
  profile,
  content,
}: {
  profile: Profile | null;
  content: ContentMap;
}) {
  const { dict } = useI18n();
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success(dict.contact.success);
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="10"
          eyebrow="CONTACT"
          heading={content.heading || "Get In Touch"}
          subheading={content.subheading}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-5">
          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="space-y-4">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 rounded-xl border border-pub-border bg-pub-surface/50 p-4 text-sm text-pub-text transition-colors hover:border-pub-accent"
                >
                  <Mail size={18} className="text-pub-accent" /> {profile.email}
                </a>
              )}
              {profile?.phone && (
                <div className="flex items-center gap-3 rounded-xl border border-pub-border bg-pub-surface/50 p-4 text-sm text-pub-text">
                  <Phone size={18} className="text-pub-accent" /> {profile.phone}
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center gap-3 rounded-xl border border-pub-border bg-pub-surface/50 p-4 text-sm text-pub-text">
                  <MapPin size={18} className="text-pub-accent" /> {profile.location}
                </div>
              )}
              {profile?.mapEmbedUrl && (
                <div className="overflow-hidden rounded-xl border border-pub-border">
                  <iframe
                    src={profile.mapEmbedUrl}
                    className="h-48 w-full grayscale"
                    loading="lazy"
                    title="Location map"
                  />
                </div>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.2} className="lg:col-span-3">
            <form
              ref={formRef}
              action={formAction}
              className="space-y-4 rounded-2xl border border-pub-border bg-pub-surface/50 p-6"
            >
              {/* Honeypot — hidden from real users, visible to naive bots */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
                aria-hidden="true"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-pub-text-muted">
                    {dict.contact.name}
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    minLength={2}
                    className="w-full rounded-lg border border-pub-border bg-pub-surface-2 px-3 py-2.5 text-sm text-pub-text outline-none focus:border-pub-accent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-pub-text-muted">
                    {dict.contact.email}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-pub-border bg-pub-surface-2 px-3 py-2.5 text-sm text-pub-text outline-none focus:border-pub-accent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="mb-1.5 block text-xs font-medium text-pub-text-muted">
                  {dict.contact.subject}
                </label>
                <input
                  id="subject"
                  name="subject"
                  className="w-full rounded-lg border border-pub-border bg-pub-surface-2 px-3 py-2.5 text-sm text-pub-text outline-none focus:border-pub-accent"
                />
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-pub-text-muted">
                  {dict.contact.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={10}
                  rows={5}
                  className="w-full resize-none rounded-lg border border-pub-border bg-pub-surface-2 px-3 py-2.5 text-sm text-pub-text outline-none focus:border-pub-accent"
                />
              </div>
              <button
                type="submit"
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-full bg-pub-accent px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                <Send size={15} />
                {pending ? dict.contact.sending : dict.contact.send}
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
