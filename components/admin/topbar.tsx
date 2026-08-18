"use client";

import { Menu, LogOut, User as UserIcon } from "lucide-react";
import { logoutAction } from "@/lib/actions/admin/auth";

export function AdminTopbar({
  title,
  userName,
  onMenuClick,
}: {
  title: string;
  userName: string;
  onMenuClick: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-adm-border bg-adm-surface/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-adm-text-muted hover:bg-adm-surface-2 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={18} />
        </button>
        <h1 className="text-base font-semibold text-adm-text sm:text-lg">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-full border border-adm-border px-3 py-1.5 text-sm text-adm-text-muted sm:flex">
          <UserIcon size={14} />
          {userName}
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg border border-adm-border px-3 py-1.5 text-sm text-adm-text-muted hover:bg-adm-surface-2"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
