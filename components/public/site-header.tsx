"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { LocaleSwitcher } from "./locale-switcher";
import type { NavigationItem, Profile } from "@/lib/types";

export function SiteHeader({
  nav,
  profile,
  logoText,
}: {
  nav: NavigationItem[];
  profile: Profile | null;
  logoText: string;
}) {
  const { locale, dict } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled
          ? "border-b border-pub-border bg-pub-bg/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          href={`/${locale}`}
          className="group flex items-center gap-2 font-display text-lg font-semibold text-pub-text"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-pub-accent/40 bg-pub-accent/10 text-pub-accent transition-colors group-hover:bg-pub-accent/20">
            <Terminal size={16} aria-hidden />
          </span>
          <span className="font-mono text-sm tracking-wider text-pub-text-muted">
            {logoText || profile?.fullName || "Portfolio"}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link
              key={item.id}
              href={item.url.startsWith("#") ? `/${locale}${item.url}` : item.url}
              target={item.openInNewTab ? "_blank" : undefined}
              className="text-sm font-medium text-pub-text-muted transition-colors hover:text-pub-accent"
            >
              {locale === "ar" && item.labelAr ? item.labelAr : item.labelEn}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitcher current={locale} />
          <Link
            href={`/${locale}#contact`}
            className="rounded-full bg-pub-accent px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
          >
            {dict.hero.contactMe}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-pub-border text-pub-text lg:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-pub-border bg-pub-bg lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {nav.map((item) => (
                <Link
                  key={item.id}
                  href={item.url.startsWith("#") ? `/${locale}${item.url}` : item.url}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-pub-text-muted hover:bg-pub-surface hover:text-pub-text"
                >
                  {locale === "ar" && item.labelAr ? item.labelAr : item.labelEn}
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between px-3">
                <LocaleSwitcher current={locale} />
                <Link
                  href={`/${locale}#contact`}
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-pub-accent px-4 py-2 text-sm font-semibold text-black"
                >
                  {dict.hero.contactMe}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
