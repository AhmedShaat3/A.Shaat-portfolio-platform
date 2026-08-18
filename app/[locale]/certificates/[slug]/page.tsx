import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck, Download, Award as AwardIcon } from "lucide-react";
import { resolveLocale } from "@/lib/i18n/params";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getCertificateBySlug } from "@/lib/data/public";
import { recordCertificateView } from "@/lib/data/analytics";
import { Reveal } from "@/components/public/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cert = await getCertificateBySlug(slug);
  if (!cert) return {};
  return { title: cert.title, description: cert.description || undefined };
}

export default async function CertificateDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const dict = getDictionary(locale);
  const cert = await getCertificateBySlug(slug);

  if (!cert) notFound();
  recordCertificateView(cert.id);

  return (
    <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <Link
        href={`/${locale}/certificates`}
        className="inline-flex items-center gap-1.5 font-mono text-sm text-pub-text-muted hover:text-pub-accent"
      >
        <ArrowLeft size={14} /> {dict.sections.certificates}
      </Link>

      <Reveal delay={0.05}>
        <div className="relative mt-8 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-pub-border bg-pub-surface-2">
          {cert.imageUrl ? (
            <Image src={cert.imageUrl} alt={cert.title} fill className="object-contain" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-pub-text-faint">
              <AwardIcon size={48} />
            </div>
          )}
        </div>

        <h1 className="mt-8 font-display text-3xl font-bold text-pub-text">{cert.title}</h1>
        <p className="mt-2 text-lg text-pub-accent">{cert.organization}</p>
        {cert.description && (
          <p className="mt-4 text-pub-text-muted">{cert.description}</p>
        )}

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-pub-border bg-pub-surface/50 p-5 sm:grid-cols-3">
          <div>
            <dt className="font-mono text-xs text-pub-text-faint">{dict.certificates.issued}</dt>
            <dd className="mt-1 text-pub-text">{cert.date}</dd>
          </div>
          {cert.certificateId && (
            <div>
              <dt className="font-mono text-xs text-pub-text-faint">
                {dict.certificates.credentialId}
              </dt>
              <dd className="mt-1 text-pub-text">{cert.certificateId}</dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          {cert.verificationUrl && (
            <a
              href={cert.verificationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-pub-accent px-5 py-2.5 text-sm font-semibold text-black"
            >
              <ShieldCheck size={15} /> {dict.certificates.verify}
            </a>
          )}
          {cert.pdfUrl && (
            <a
              href={cert.pdfUrl}
              download
              className="inline-flex items-center gap-2 rounded-full border border-pub-border px-5 py-2.5 text-sm font-semibold text-pub-text hover:border-pub-accent"
            >
              <Download size={15} /> {dict.certificates.download}
            </a>
          )}
        </div>
      </Reveal>
    </article>
  );
}
