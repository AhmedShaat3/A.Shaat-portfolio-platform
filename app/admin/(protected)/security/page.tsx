import { getActiveSessionCount } from "@/lib/actions/admin/security";
import { SecuritySettings } from "@/components/admin/security-settings";

export const metadata = { title: "Security" };

export default async function SecurityAdminPage() {
  const sessionCount = await getActiveSessionCount();
  return <SecuritySettings sessionCount={sessionCount} />;
}
