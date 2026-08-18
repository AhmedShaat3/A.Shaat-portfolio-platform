import { getAllAwardsAdmin } from "@/lib/data/admin";
import { AwardsManager } from "@/components/admin/awards-manager";

export const metadata = { title: "Awards" };

export default async function AwardsAdminPage() {
  const items = await getAllAwardsAdmin();
  return <AwardsManager items={items} />;
}
