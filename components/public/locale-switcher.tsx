"use client";

import { usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { locales, type Locale } from "@/lib/i18n/config";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(locale: Locale) {
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/") || "/");
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-pub-border bg-pub-surface/60 p-1 text-xs font-mono">
      <Languages size={14} className="mx-1.5 text-pub-text-muted" aria-hidden />
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => switchTo(locale)}
          aria-pressed={locale === current}
          className={`rounded-full px-2.5 py-1 uppercase tracking-wide transition-colors ${
            locale === current
              ? "bg-pub-accent text-black"
              : "text-pub-text-muted hover:text-pub-text"
          }`}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
