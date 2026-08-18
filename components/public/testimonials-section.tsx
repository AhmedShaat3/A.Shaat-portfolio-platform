"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { useI18n } from "@/lib/i18n/provider";
import type { Testimonial, ContentMap } from "@/lib/types";

export function TestimonialsSection({
  testimonials,
  content,
}: {
  testimonials: Testimonial[];
  content: ContentMap;
}) {
  const [index, setIndex] = useState(0);
  const { dict } = useI18n();
  if (testimonials.length === 0) return null;
  const current = testimonials[index];

  return (
    <section id="testimonials" className="border-b border-pub-border py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeading
          index="09"
          eyebrow="TESTIMONIALS"
          heading={content.heading || "Testimonials"}
          align="center"
        />

        <div className="relative mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="rounded-2xl border border-pub-border bg-pub-surface/50 p-8 text-center"
            >
              <Quote className="mx-auto mb-4 text-pub-accent" size={28} />
              {current.isPlaceholder && (
                <span className="mb-3 inline-block rounded-full border border-pub-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-pub-text-faint">
                  {dict.common.demo}
                </span>
              )}
              <p className="text-lg text-pub-text">&ldquo;{current.quote}&rdquo;</p>
              <div className="mt-5 flex items-center justify-center gap-1">
                {Array.from({ length: current.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-pub-accent text-pub-accent" />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-3">
                {current.photoUrl ? (
                  <Image
                    src={current.photoUrl}
                    alt={current.person}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pub-surface-2 font-mono text-xs text-pub-text-faint">
                    {current.person.charAt(0)}
                  </div>
                )}
                <div className="text-start">
                  <p className="text-sm font-semibold text-pub-text">{current.person}</p>
                  <p className="text-xs text-pub-text-muted">
                    {current.position}
                    {current.company ? ` · ${current.company}` : ""}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {testimonials.length > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
              <button
                type="button"
                aria-label="Previous testimonial"
                onClick={() =>
                  setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border border-pub-border text-pub-text-muted hover:border-pub-accent hover:text-pub-accent"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex gap-1.5">
                {testimonials.map((t, i) => (
                  <button
                    key={t.id}
                    aria-label={`Go to testimonial ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-6 bg-pub-accent" : "w-1.5 bg-pub-border"
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                aria-label="Next testimonial"
                onClick={() => setIndex((i) => (i + 1) % testimonials.length)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-pub-border text-pub-text-muted hover:border-pub-accent hover:text-pub-accent"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
