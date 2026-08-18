"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Award,
  Briefcase,
  Layers,
  GraduationCap,
  Trophy,
  MessageSquareQuote,
  Image as ImageIcon,
  FolderOpen,
  Navigation as NavigationIcon,
  Palette,
  Search,
  Mail,
  Settings,
  ShieldAlert,
  DatabaseBackup,
  ListOrdered,
  ExternalLink,
} from "lucide-react";

const contentLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Website Content", icon: FileText },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Layers },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/awards", label: "Awards", icon: Trophy },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { href: "/admin/media", label: "Media", icon: FolderOpen },
];

const websiteLinks = [
  { href: "/admin/navigation", label: "Navigation", icon: NavigationIcon },
  { href: "/admin/sections", label: "Sections", icon: ListOrdered },
  { href: "/admin/appearance", label: "Appearance", icon: Palette },
  { href: "/admin/seo", label: "SEO", icon: Search },
];

const systemLinks = [
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/security", label: "Security", icon: ShieldAlert },
  { href: "/admin/backup", label: "Backup", icon: DatabaseBackup },
];

function NavGroup({
  title,
  links,
  pathname,
}: {
  title: string;
  links: typeof contentLinks;
  pathname: string;
}) {
  return (
    <div className="mb-6">
      <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-widest text-adm-text-muted">
        {title}
      </p>
      <div className="space-y-0.5">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(link.href + "/");
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-adm-accent-soft font-medium text-adm-accent"
                  : "text-adm-text-muted hover:bg-adm-surface-2 hover:text-adm-text"
              }`}
            >
              <Icon size={16} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function AdminSidebar({ open }: { open: boolean }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 overflow-y-auto border-r border-adm-border bg-adm-surface px-3 py-5 transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <Link href="/admin/dashboard" className="mb-6 flex items-center gap-2 px-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-adm-accent text-sm font-bold text-white">
          A
        </div>
        <span className="font-semibold text-adm-text">Portfolio CMS</span>
      </Link>

      <NavGroup title="Content" links={contentLinks} pathname={pathname} />
      <NavGroup title="Website" links={websiteLinks} pathname={pathname} />
      <NavGroup title="System" links={systemLinks} pathname={pathname} />

      <a
        href="/en"
        target="_blank"
        rel="noreferrer"
        className="mt-2 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-adm-text-muted hover:bg-adm-surface-2 hover:text-adm-text"
      >
        <ExternalLink size={16} />
        View Live Site
      </a>
    </aside>
  );
}
