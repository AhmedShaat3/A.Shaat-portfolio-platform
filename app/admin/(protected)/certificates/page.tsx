import { getAllCertificatesAdmin } from "@/lib/data/admin";
import { CertificatesManager } from "@/components/admin/certificates-manager";

export const metadata = { title: "Certificates" };

export default async function CertificatesAdminPage() {
  const items = await getAllCertificatesAdmin();
  return <CertificatesManager items={items} />;
}
