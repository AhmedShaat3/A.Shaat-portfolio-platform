import { getSiteSettings } from "@/lib/data/public";
import { AppearanceEditor } from "@/components/admin/appearance-editor";

export const metadata = { title: "Appearance" };

export default async function AppearanceAdminPage() {
  const settings = await getSiteSettings();
  return <AppearanceEditor settings={settings} />;
}
