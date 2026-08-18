import { SectionHeading } from "./section-heading";
import { CertificateGrid } from "./certificate-grid";
import type { Certificate, ContentMap } from "@/lib/types";

export function CertificatesSection({
  certificates,
  content,
}: {
  certificates: Certificate[];
  content: ContentMap;
}) {
  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="border-b border-pub-border py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="05"
          eyebrow="CERTIFICATES"
          heading={content.heading || "Certificates"}
          subheading={content.subheading}
        />
        <CertificateGrid certificates={certificates} />
      </div>
    </section>
  );
}
