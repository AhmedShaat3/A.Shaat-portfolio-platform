"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, Download, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./brand-icons";
import { useI18n } from "@/lib/i18n/provider";
import type { Profile, ContentMap } from "@/lib/types";

function useTypingEffect(phrases: string[]) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;
    const current = phrases[phraseIndex % phrases.length];
    const speed = deleting ? 30 : 55;

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (text.length < current.length) {
          setText(current.slice(0, text.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 1400);
        }
      } else {
        if (text.length > 0) {
          setText(current.slice(0, text.length - 1));
        } else {
          setDeleting(false);
          setPhraseIndex((i) => i + 1);
        }
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [text, deleting, phraseIndex, phrases]);

  return text;
}

export function Hero({
  profile,
  content,
}: {
  profile: Profile | null;
  content: ContentMap;
}) {
  const { dict } = useI18n();
  const phrases: string[] = profile?.typingPhrases
    ? JSON.parse(profile.typingPhrases)
    : [];
  const typed = useTypingEffect(phrases);

  return (
    <section className="relative overflow-hidden border-b border-pub-border">
      <div className="scan-grid absolute inset-0" aria-hidden />
      <div className="scan-line" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-pub-bg"
        aria-hidden
      />
      <div
        className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(41,216,240,0.35), transparent)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-72px)] max-w-6xl flex-col justify-center px-5 py-24 sm:px-8">
        {content.eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-pub-terminal-green/30 bg-pub-terminal-green/10 px-3 py-1 font-mono text-[11px] tracking-widest text-pub-terminal-green"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pub-terminal-green opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-pub-terminal-green" />
            </span>
            {content.eyebrow}
          </motion.div>
        )}

        <div className="flex flex-col-reverse items-start gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="font-display text-4xl font-bold leading-[1.08] text-pub-text sm:text-6xl"
            >
              {profile?.fullName || "Your Name"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-3 font-mono text-sm text-pub-accent sm:text-base"
            >
              {profile?.title}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-6 max-w-xl text-base text-pub-text-muted sm:text-lg"
            >
              {profile?.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-6 flex h-6 items-center rounded-md border border-pub-border bg-pub-surface/60 px-3 font-mono text-sm text-pub-text-muted"
            >
              <span className="mr-2 text-pub-terminal-green">$</span>
              <span>{typed}</span>
              <span className="cursor-blink ml-0.5 h-4 w-[2px] bg-pub-accent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              {profile?.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-pub-accent px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
                >
                  <Download size={16} /> {dict.hero.downloadCv}
                </a>
              )}
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-pub-border px-5 py-2.5 text-sm font-semibold text-pub-text transition-colors hover:border-pub-accent hover:text-pub-accent"
              >
                <Mail size={16} /> {dict.hero.contactMe}
              </Link>
              {profile?.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-pub-border text-pub-text-muted transition-colors hover:border-pub-accent hover:text-pub-accent"
                >
                  <GithubIcon size={18} />
                </a>
              )}
              {profile?.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-pub-border text-pub-text-muted transition-colors hover:border-pub-accent hover:text-pub-accent"
                >
                  <LinkedinIcon size={18} />
                </a>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative shrink-0"
          >
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-pub-accent/30 to-pub-accent-2/20 blur-2xl" />
            <div className="relative h-44 w-44 overflow-hidden rounded-3xl border border-pub-border bg-pub-surface sm:h-56 sm:w-56">
              {profile?.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-5xl font-semibold text-pub-text-faint">
                  {(profile?.fullName || "BB")
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[11px] tracking-widest text-pub-text-faint"
      >
        {dict.hero.scroll}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
