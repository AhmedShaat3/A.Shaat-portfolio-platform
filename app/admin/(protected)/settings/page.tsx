import { getSiteSettings } from "@/lib/data/public";
import { SettingsEditor } from "@/components/admin/settings-editor";

export const metadata = { title: "Settings" };

export default async function SettingsAdminPage() {
  const settings = await getSiteSettings();
  return <SettingsEditor settings={settings} />;
}
