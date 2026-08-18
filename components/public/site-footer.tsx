"use client";

import Link from "next/link";
import { ArrowUp, Mail, Link as LinkIcon } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./brand-icons";
import { useI18n } from "@/lib/i18n/provider";
import type { NavigationItem, SocialLink } from "@/lib/types";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  twitter: TwitterIcon,
  email: Mail,
};

export function SiteFooter({
  nav,
  social,
  logoText,
}: {
  nav: NavigationItem[];
  social: SocialLink[];
  logoText: string;
}) {
  const { locale, dict } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-pub-border bg-pub-bg-elevated">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <span className="font-display text-lg font-semibold text-pub-text">
              {logoText}
            </span>
            <p className="mt-1 max-w-xs text-sm text-pub-text-muted">
              &copy; {year} {logoText}. {dict.footer.rights}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            {nav.map((item) => (
              <Link
                key={item.id}
                href={item.url.startsWith("#") ? `/${locale}${item.url}` : item.url}
                className="text-sm text-pub-text-muted hover:text-pub-accent"
              >
                {locale === "ar" && item.labelAr ? item.labelAr : item.labelEn}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {social.map((link) => {
              const Icon = ICONS[link.platform] ?? LinkIcon;
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.platform}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-pub-border text-pub-text-muted transition-colors hover:border-pub-accent hover:text-pub-accent"
                >
                  <Icon size={16} />
                </a>
              );
            })}
            <a
              href="#top"
              aria-label={dict.footer.backToTop}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-pub-border text-pub-text-muted transition-colors hover:border-pub-accent hover:text-pub-accent"
            >
              <ArrowUp size={16} />
            </a>
          </div>
        </div>

        <p className="mt-8 font-mono text-xs text-pub-text-faint">
          {dict.footer.builtWith}
        </p>
      </div>
    </footer>
  );
}
