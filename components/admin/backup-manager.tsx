"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Download, Upload, DatabaseBackup, AlertTriangle } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/fields";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { exportBackup, importBackup } from "@/lib/actions/admin/backup";

export function BackupManager() {
  const [pending, startTransition] = useTransition();
  const [confirmFile, setConfirmFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    startTransition(async () => {
      const result = await exportBackup();
      if (!result.ok) {
        toast.error(result.error || "Export failed.");
        return;
      }
      if (!result.data) {
        toast.error("Export failed.");
        return;
      }
      const blob = new Blob([result.data.json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Backup downloaded.");
    });
  }

  function handleImportConfirmed() {
    if (!confirmFile) return;
    const file = confirmFile;
    startTransition(async () => {
      const text = await file.text();
      const result = await importBackup(text);
      if (!result.ok) {
        toast.error(result.error || "Import failed.");
        return;
      }
      toast.success("Backup imported successfully.");
      setConfirmFile(null);
      setTimeout(() => window.location.reload(), 800);
    });
  }

  return (
    <div className="max-w-xl space-y-6">
      <Card>
        <div className="flex items-center gap-2 text-sm font-semibold text-adm-text">
          <Download size={16} className="text-adm-accent" /> Export Data
        </div>
        <p className="mt-2 text-sm text-adm-text-muted">
          Download a complete JSON snapshot of your portfolio content — profile, skills,
          experience, projects, certificates, awards, testimonials, gallery, statistics,
          navigation, and content text.
        </p>
        <Button type="button" onClick={handleExport} disabled={pending} className="mt-4">
          <Download size={15} /> {pending ? "Preparing..." : "Export Backup (JSON)"}
        </Button>
      </Card>

      <Card>
        <div className="flex items-center gap-2 text-sm font-semibold text-adm-text">
          <Upload size={16} className="text-adm-accent" /> Import Data
        </div>
        <p className="mt-2 flex items-start gap-2 text-sm text-adm-warning">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          Importing replaces existing content in the affected tables. Your admin
          account, sessions, and contact messages are never touched by an import.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setConfirmFile(file);
            e.target.value = "";
          }}
        />
        <Button
          type="button"
          variant="secondary"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className="mt-4"
        >
          <DatabaseBackup size={15} /> Choose Backup File...
        </Button>
      </Card>

      <ConfirmDialog
        open={!!confirmFile}
        title="Import this backup?"
        description={`This will replace your current content with the contents of "${confirmFile?.name}". This cannot be undone.`}
        confirmLabel="Import"
        onConfirm={handleImportConfirmed}
        onCancel={() => setConfirmFile(null)}
        loading={pending}
      />
    </div>
  );
}
