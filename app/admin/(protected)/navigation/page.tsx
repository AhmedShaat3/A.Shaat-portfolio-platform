import { getAllNavigation } from "@/lib/data/public";
import { NavigationManager } from "@/components/admin/navigation-manager";

export const metadata = { title: "Navigation" };

export default async function NavigationAdminPage() {
  const items = await getAllNavigation();
  return <NavigationManager items={items} />;
}
