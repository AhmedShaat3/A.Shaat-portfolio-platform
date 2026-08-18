import type { Metadata } from "next";
import { resolveLocale } from "@/lib/i18n/params";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getPublishedCertificates } from "@/lib/data/public";
import { getSectionContent } from "@/lib/data/content";
import { CertificateGrid } from "@/components/public/certificate-grid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const dict = getDictionary(resolveLocale(rawLocale));
  return { title: dict.sections.certificates };
}

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = getDictionary(locale);
  const [certificates, content] = await Promise.all([
    getPublishedCertificates(),
    getSectionContent("certificates", locale),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-pub-accent">
        CERTIFICATES
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-pub-text sm:text-4xl">
        {dict.sections.certificates}
      </h1>
      {content.subheading && (
        <p className="mt-3 max-w-2xl text-pub-text-muted">{content.subheading}</p>
      )}
      <CertificateGrid certificates={certificates} />
    </div>
  );
}
