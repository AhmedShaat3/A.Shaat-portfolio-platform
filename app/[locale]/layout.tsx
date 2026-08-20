import type { Metadata } from "next";
import { Toaster } from "sonner";
import "../globals.css";
import { locales, localeDirection } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/params";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { I18nProvider } from "@/lib/i18n/provider";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import {
  getProfile,
  getSiteSettings,
  getVisibleNavigation,
  getVisibleSocialLinks,
} from "@/lib/data/public";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const settings = await getSiteSettings();
  const profile = await getProfile();

  const title = settings?.siteTitle || profile?.fullName || "Portfolio";
  const description =
    settings?.siteDescription || profile?.tagline || undefined;

  return {
    title: { default: title, template: `%s · ${title}` },
    description,
    // ✅ تم إصلاح الخطأ هنا بإضافة (k: string)
    keywords: settings?.keywords?.split(",").map((k: string) => k.trim()),
    authors: settings?.author ? [{ name: settings.author }] : undefined,
    metadataBase: settings?.canonicalUrl
      ? new URL(settings.canonicalUrl)
      : undefined,
    alternates: {
      canonical: settings?.canonicalUrl,
      languages: { en: "/en", ar: "/ar" },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale,
      images: settings?.ogImageUrl ? [settings.ogImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: settings?.ogImageUrl ? [settings.ogImageUrl] : undefined,
    },
    icons: settings?.faviconUrl ? { icon: settings.faviconUrl } : undefined,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = getDictionary(locale);
  const dir = localeDirection[locale];

  const [profile, settings, nav, social] = await Promise.all([
    getProfile(),
    getSiteSettings(),
    getVisibleNavigation(),
    getVisibleSocialLinks(),
  ]);

  return (
    <html lang={locale} dir={dir} className="h-full antialiased">
      <body
        className="pub-scope flex min-h-full flex-col bg-pub-bg font-body text-pub-text"
        id="top"
      >
        <I18nProvider locale={locale} dict={dict}>
          <SiteHeader
            nav={nav}
            profile={profile}
            logoText={settings?.logoText || profile?.fullName || "Portfolio"}
          />
          <main className="flex-1">{children}</main>
          <SiteFooter
            nav={nav}
            social={social}
            logoText={settings?.logoText || profile?.fullName || "Portfolio"}
          />
        </I18nProvider>
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}