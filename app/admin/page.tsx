import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AdminIndexPage() {
  const user = await getCurrentUser();
  redirect(user ? "/admin/dashboard" : "/admin/login");
}
