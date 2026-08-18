"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { ShieldCheck, Lock } from "lucide-react";
import { loginAction, type LoginFormState } from "@/lib/actions/admin/auth";

const initialState: LoginFormState = { ok: false };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-adm-accent text-white">
            <ShieldCheck size={22} />
          </div>
          <h1 className="mt-4 text-xl font-semibold text-adm-text">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-adm-text-muted">
            Sign in to manage your portfolio.
          </p>
        </div>

        <form
          action={formAction}
          className="space-y-4 rounded-2xl border border-adm-border bg-adm-surface p-6 shadow-sm"
        >
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-adm-text-muted">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-adm-border bg-adm-surface-2 px-3 py-2.5 text-sm outline-none focus:border-adm-accent"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-adm-text-muted">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-adm-border bg-adm-surface-2 px-3 py-2.5 text-sm outline-none focus:border-adm-accent"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-adm-accent px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            <Lock size={15} />
            {pending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
