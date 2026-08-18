"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { resolveIcon } from "@/lib/utils/icons";
import { useI18n } from "@/lib/i18n/provider";
import type { Statistic, ContentMap } from "@/lib/types";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-4xl font-bold text-pub-text sm:text-5xl">
      {display}
      {suffix}
    </span>
  );
}

export function StatsSection({
  stats,
  content,
}: {
  stats: Statistic[];
  content: ContentMap;
}) {
  const { locale } = useI18n();
  if (stats.length === 0) return null;

  return (
    <section id="stats" className="border-b border-pub-border py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {content.heading && (
          <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-pub-accent">
            {content.heading}
          </p>
        )}
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => {
            const Icon = resolveIcon(stat.icon);
            return (
              <div key={stat.id} className="text-center">
                <Icon className="mx-auto mb-2 text-pub-accent" size={22} />
                <Counter value={stat.value} suffix={stat.suffix || ""} />
                <p className="mt-1 text-sm text-pub-text-muted">
                  {locale === "ar" && stat.labelAr ? stat.labelAr : stat.labelEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
