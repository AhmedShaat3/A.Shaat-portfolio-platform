import { getSiteSettings } from "@/lib/data/public";
import { SeoEditor } from "@/components/admin/seo-editor";

export const metadata = { title: "SEO" };

export default async function SeoAdminPage() {
  const settings = await getSiteSettings();
  return <SeoEditor settings={settings} />;
}
