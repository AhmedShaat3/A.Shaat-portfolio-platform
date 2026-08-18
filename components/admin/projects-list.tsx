"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, ExternalLink } from "lucide-react";
import { Button } from "./ui/fields";
import { Card } from "./ui/card";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { deleteProject, updateProject } from "@/lib/actions/admin/projects";
import type { Project } from "@/lib/types";

export function ProjectsList({ items }: { items: Project[] }) {
  const [list, setList] = useState(items);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!deleting) return;
    startTransition(async () => {
      const result = await deleteProject(deleting.id);
      if (!result.ok) {
        toast.error(result.error || "Delete failed.");
        return;
      }
      toast.success("Project deleted successfully.");
      setList((l) => l.filter((p) => p.id !== deleting.id));
      setDeleting(null);
    });
  }

  function togglePublished(project: Project) {
    startTransition(async () => {
      const result = await updateProject(project.id, {
        title: project.title,
        slug: project.slug,
        shortDescription: project.shortDescription ?? "",
        fullDescription: project.fullDescription ?? "",
        category: project.category,
        technologies: JSON.parse(project.technologies || "[]"),
        mainImageUrl: project.mainImageUrl ?? "",
        githubUrl: project.githubUrl ?? "",
        liveUrl: project.liveUrl ?? "",
        featured: project.featured,
        status: project.status,
        stats: JSON.parse(project.stats || "[]"),
        challenges: project.challenges ?? "",
        solution: project.solution ?? "",
        results: project.results ?? "",
        seoTitle: project.seoTitle ?? "",
        seoDescription: project.seoDescription ?? "",
        order: project.order,
        published: !project.published,
      });
      if (!result.ok) {
        toast.error(result.error || "Update failed.");
        return;
      }
      setList((l) =>
        l.map((p) => (p.id === project.id ? { ...p, published: !p.published } : p))
      );
      toast.success("Changes saved.");
    });
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Link href="/admin/projects/new">
          <Button type="button">
            <Plus size={15} /> Add Project
          </Button>
        </Link>
      </div>

      {list.length === 0 ? (
        <Card className="flex flex-col items-center py-12 text-center">
          <p className="text-sm text-adm-text-muted">No projects yet.</p>
          <Link href="/admin/projects/new" className="mt-3">
            <Button variant="secondary" type="button">
              <Plus size={15} /> Add your first project
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-2">
          {list.map((p) => (
            <Card key={p.id} className="flex flex-wrap items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-adm-text">{p.title}</p>
                  {p.featured && <Star size={13} className="fill-adm-accent text-adm-accent" />}
                </div>
                <p className="truncate text-xs text-adm-text-muted">
                  {p.category} · /{p.slug}
                </p>
              </div>

              <button
                type="button"
                onClick={() => togglePublished(p)}
                disabled={pending}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  p.published
                    ? "bg-emerald-50 text-adm-success"
                    : "bg-gray-100 text-adm-text-muted"
                }`}
              >
                {p.published ? "Published" : "Draft"}
              </button>

              <a
                href={`/en/projects/${p.slug}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-adm-text-muted hover:bg-adm-surface-2"
                aria-label="Preview"
              >
                <ExternalLink size={15} />
              </a>
              <Link
                href={`/admin/projects/${p.id}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-adm-text-muted hover:bg-adm-surface-2"
                aria-label="Edit"
              >
                <Pencil size={15} />
              </Link>
              <button
                type="button"
                onClick={() => setDeleting(p)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-adm-text-muted hover:bg-red-50 hover:text-adm-danger"
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </button>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete this project?"
        description="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={pending}
      />
    </div>
  );
}
