import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Sign In" };

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin/dashboard");
  return <LoginForm />;
}
