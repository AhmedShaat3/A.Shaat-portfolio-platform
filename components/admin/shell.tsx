"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "./sidebar";
import { AdminTopbar } from "./topbar";

const TITLES: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/content": "Website Content",
  "/admin/projects": "Projects",
  "/admin/certificates": "Certificates",
  "/admin/experience": "Experience",
  "/admin/skills": "Skills",
  "/admin/education": "Education",
  "/admin/awards": "Awards",
  "/admin/testimonials": "Testimonials",
  "/admin/gallery": "Gallery",
  "/admin/media": "Media Library",
  "/admin/navigation": "Navigation",
  "/admin/sections": "Sections",
  "/admin/appearance": "Appearance",
  "/admin/seo": "SEO",
  "/admin/messages": "Messages",
  "/admin/settings": "Settings",
  "/admin/security": "Security",
  "/admin/backup": "Backup",
};

function titleFor(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  const base = "/" + pathname.split("/").slice(1, 3).join("/");
  return TITLES[base] ?? "Admin";
}

export function AdminShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar open={open} />
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          title={titleFor(pathname)}
          userName={userName}
          onMenuClick={() => setOpen((v) => !v)}
        />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
