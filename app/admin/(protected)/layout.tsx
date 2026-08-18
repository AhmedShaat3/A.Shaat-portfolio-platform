import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/shell";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is the real, authoritative auth check (the proxy/middleware check
  // is only a fast cookie-presence pre-filter). Every protected admin page
  // renders behind this.
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return <AdminShell userName={user.name}>{children}</AdminShell>;
}
