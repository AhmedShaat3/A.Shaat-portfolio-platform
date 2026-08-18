import { getAllSections } from "@/lib/data/public";
import { SectionsManager } from "@/components/admin/sections-manager";

export const metadata = { title: "Sections" };

export default async function SectionsAdminPage() {
  const items = await getAllSections();
  return <SectionsManager items={items} />;
}
