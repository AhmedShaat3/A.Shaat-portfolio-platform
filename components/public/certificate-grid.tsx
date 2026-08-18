"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Download, ShieldCheck, Award as AwardIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import type { Certificate } from "@/lib/types";

export function CertificateGrid({ certificates }: { certificates: Certificate[] }) {
  const [active, setActive] = useState<Certificate | null>(null);
  const { dict } = useI18n();

  return (
    <>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, i) => (
          <motion.button
            key={cert.id}
            type="button"
            onClick={() => setActive(cert)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
            className="group flex flex-col overflow-hidden rounded-2xl border border-pub-border bg-pub-surface/50 text-left transition-colors hover:border-pub-accent/50"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-pub-surface-2">
              {cert.imageUrl ? (
                <Image
                  src={cert.imageUrl}
                  alt={cert.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-pub-text-faint">
                  <AwardIcon size={32} />
                </div>
              )}
            </div>
            <div className="p-5">
              <h3 className="font-display text-base font-semibold text-pub-text">
                {cert.title}
              </h3>
              <p className="mt-1 text-sm text-pub-accent">{cert.organization}</p>
              <p className="mt-1 font-mono text-xs text-pub-text-faint">
                {dict.certificates.issued}: {cert.date}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-pub-border bg-pub-surface p-6"
            >
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-pub-border text-pub-text-muted hover:text-pub-text"
              >
                <X size={16} />
              </button>

              {active.imageUrl && (
                <div className="relative mb-5 aspect-[4/3] w-full overflow-hidden rounded-xl bg-pub-surface-2">
                  <Image src={active.imageUrl} alt={active.title} fill className="object-contain" />
                </div>
              )}

              <h3 className="font-display text-xl font-semibold text-pub-text">
                {active.title}
              </h3>
              <p className="mt-1 text-pub-accent">{active.organization}</p>
              {active.description && (
                <p className="mt-3 text-sm text-pub-text-muted">{active.description}</p>
              )}
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="font-mono text-xs text-pub-text-faint">
                    {dict.certificates.issued}
                  </dt>
                  <dd className="text-pub-text">{active.date}</dd>
                </div>
                {active.certificateId && (
                  <div>
                    <dt className="font-mono text-xs text-pub-text-faint">
                      {dict.certificates.credentialId}
                    </dt>
                    <dd className="text-pub-text">{active.certificateId}</dd>
                  </div>
                )}
              </dl>
              <div className="mt-5 flex flex-wrap gap-3">
                {active.verificationUrl && (
                  <a
                    href={active.verificationUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-pub-accent px-4 py-2 text-sm font-semibold text-black"
                  >
                    <ShieldCheck size={14} /> {dict.certificates.verify}
                  </a>
                )}
                {active.pdfUrl && (
                  <a
                    href={active.pdfUrl}
                    download
                    className="inline-flex items-center gap-1.5 rounded-full border border-pub-border px-4 py-2 text-sm font-semibold text-pub-text hover:border-pub-accent"
                  >
                    <Download size={14} /> {dict.certificates.download}
                  </a>
                )}
                {active.imageUrl && (
                  <a
                    href={active.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-pub-border px-4 py-2 text-sm font-semibold text-pub-text hover:border-pub-accent"
                  >
                    <ExternalLink size={14} /> {dict.certificates.preview}
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
