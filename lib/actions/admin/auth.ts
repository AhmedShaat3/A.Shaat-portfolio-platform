"use server";

import { redirect } from "next/navigation";
import { loginWithPassword } from "@/lib/auth/login";
import { destroySession } from "@/lib/auth/session";
import { logActivity } from "@/lib/activity";
import { getCurrentUser } from "@/lib/auth/session";
import { loginSchema } from "@/lib/validation/schemas";

export type LoginFormState = {
  ok: boolean;
  error?: string;
};

export async function loginAction(
  _prev: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const result = await loginWithPassword(parsed.data.email, parsed.data.password);
  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  redirect("/admin/dashboard");
}

export async function logoutAction() {
  const user = await getCurrentUser();
  if (user) {
    await logActivity({ userId: user.id, action: "auth.logout" });
  }
  await destroySession();
  redirect("/admin/login");
}
