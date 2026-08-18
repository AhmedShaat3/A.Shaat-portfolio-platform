import Link from "next/link";
import {
  FolderKanban,
  Award,
  ImageIcon,
  Briefcase,
  Mail,
  Activity,
  Plus,
  Pencil,
  UploadCloud,
  Layers,
  Globe,
  Clock,
} from "lucide-react";
import { db } from "@/db/client";
import { projects, certificates, galleryImages, experiences, contactMessages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSiteSettings } from "@/lib/data/public";
import { getRecentActivity } from "@/lib/data/admin";
import { StatCard } from "@/components/admin/ui/stat-card";
import { Card } from "@/components/admin/ui/card";

export const metadata = { title: "Dashboard" };

const ACTION_LABELS: Record<string, string> = {
  "project.created": "created a project",
  "project.updated": "updated a project",
  "project.deleted": "deleted a project",
  "certificate.created": "created a certificate",
  "certificate.updated": "updated a certificate",
  "skill.created": "added a skill",
  "skill.updated": "updated a skill",
  "media.uploaded": "uploaded a file",
  "content.updated": "edited site content",
  "profile.updated": "updated the profile",
  "settings.updated": "updated settings",
  "site.published": "published the site",
  "auth.login": "signed in",
  "auth.password_changed": "changed their password",
};

export default async function DashboardPage() {
  const [
    allProjects,
    allCertificates,
    allGallery,
    allExperiences,
    unreadMessages,
    settings,
    activity,
  ] = await Promise.all([
    db.select().from(projects),
    db.select().from(certificates),
    db.select().from(galleryImages),
    db.select().from(experiences),
    db.select().from(contactMessages).where(eq(contactMessages.read, false)),
    getSiteSettings(),
    getRecentActivity(10),
  ]);

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={FolderKanban} label="Projects" value={allProjects.length} href="/admin/projects" />
        <StatCard icon={Award} label="Certificates" value={allCertificates.length} href="/admin/certificates" />
        <StatCard icon={ImageIcon} label="Gallery Images" value={allGallery.length} href="/admin/gallery" />
        <StatCard icon={Briefcase} label="Experience" value={allExperiences.length} href="/admin/experience" />
        <StatCard icon={Mail} label="New Messages" value={unreadMessages.length} href="/admin/messages" />
        <StatCard icon={Globe} label="Published Ver." value={settings?.publishedVersion ?? "1.0"} href="/admin/settings" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-adm-text">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: "Edit Hero", href: "/admin/content", icon: Pencil },
              { label: "Add Project", href: "/admin/projects/new", icon: Plus },
              { label: "Add Certificate", href: "/admin/certificates", icon: Plus },
              { label: "Upload Image", href: "/admin/media", icon: UploadCloud },
              { label: "Add Experience", href: "/admin/experience", icon: Plus },
              { label: "Edit Skills", href: "/admin/skills", icon: Layers },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-adm-border p-4 text-center text-xs font-medium text-adm-text-muted transition-colors hover:border-adm-accent hover:bg-adm-accent-soft hover:text-adm-accent"
              >
                <action.icon size={18} />
                {action.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between rounded-xl border border-adm-border bg-adm-surface-2 p-4">
            <div className="flex items-center gap-2 text-sm text-adm-text">
              <Clock size={14} className="text-adm-text-muted" />
              Website status
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-adm-success">
              <span className="h-1.5 w-1.5 rounded-full bg-adm-success" /> Live
            </span>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-adm-text">
            <Activity size={15} /> Recent Activity
          </h2>
          {activity.length === 0 ? (
            <p className="text-sm text-adm-text-muted">No activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {activity.map((a) => (
                <li key={a.id} className="text-xs text-adm-text-muted">
                  <span className="text-adm-text">
                    {ACTION_LABELS[a.action] ?? a.action}
                  </span>
                  <br />
                  {new Date(a.createdAt).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
