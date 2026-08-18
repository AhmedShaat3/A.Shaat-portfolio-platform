"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Copy, Trash2, FileText, Search } from "lucide-react";
import { ImageUploader } from "./ui/image-uploader";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { Select } from "./ui/fields";
import type { Media } from "@/lib/types";

const FOLDERS = ["all", "profile", "projects", "certificates", "gallery", "logos", "other", "cv"] as const;

export function MediaLibrary({ items }: { items: Media[] }) {
  const [list, setList] = useState(items);
  const [folder, setFolder] = useState<(typeof FOLDERS)[number]>("all");
  const [query, setQuery] = useState("");
  const [deleting, setDeleting] = useState<Media | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered = list.filter((m) => {
    const matchesFolder = folder === "all" || m.folder === folder;
    const matchesQuery =
      !query || m.originalName.toLowerCase().includes(query.toLowerCase());
    return matchesFolder && matchesQuery;
  });

  function handleDelete() {
    if (!deleting) return;
    startTransition(async () => {
      const res = await fetch("/api/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleting.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Delete failed.");
        return;
      }
      setList((l) => l.filter((m) => m.id !== deleting.id));
      toast.success("File deleted.");
      setDeleting(null);
    });
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(window.location.origin + url);
    toast.success("URL copied to clipboard.");
  }

  return (
    <div>
      <div className="mb-5 rounded-2xl border border-adm-border bg-adm-surface p-5">
        <p className="mb-2 text-sm font-medium text-adm-text">Upload a file</p>
        <ImageUploader
          value=""
          onChange={(url) => {
            if (url) window.location.reload();
          }}
          folder="other"
          accept="image/*,application/pdf"
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative max-w-xs flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-adm-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search filename..."
            className="w-full rounded-lg border border-adm-border bg-adm-surface-2 py-2 pl-8 pr-3 text-sm outline-none focus:border-adm-accent"
          />
        </div>
        <Select value={folder} onChange={(e) => setFolder(e.target.value as typeof folder)} className="w-auto">
          {FOLDERS.map((f) => (
            <option key={f} value={f}>
              {f === "all" ? "All folders" : f}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-adm-text-muted">No files found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-xl border border-adm-border bg-adm-surface">
              <div className="relative flex aspect-square items-center justify-center bg-adm-surface-2">
                {m.mimeType === "application/pdf" ? (
                  <FileText size={28} className="text-adm-text-muted" />
                ) : (
                  <Image src={m.url} alt={m.altText || m.originalName} fill className="object-cover" />
                )}
              </div>
              <div className="p-2.5">
                <p className="truncate text-xs font-medium text-adm-text">{m.originalName}</p>
                <p className="text-[11px] text-adm-text-muted">
                  {(m.size / 1024).toFixed(0)} KB · {m.folder}
                </p>
                <div className="mt-2 flex gap-1">
                  <button
                    type="button"
                    onClick={() => copyUrl(m.url)}
                    className="flex h-7 flex-1 items-center justify-center gap-1 rounded-md border border-adm-border text-xs text-adm-text-muted hover:bg-adm-surface-2"
                  >
                    <Copy size={11} /> Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleting(m)}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-adm-border text-adm-text-muted hover:bg-red-50 hover:text-adm-danger"
                    aria-label="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title="Delete this file?"
        description="This will permanently remove the file from storage."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={pending}
      />
    </div>
  );
}
