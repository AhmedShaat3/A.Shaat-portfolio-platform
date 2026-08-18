"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "./fields";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  loading,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-adm-border bg-adm-surface p-6 shadow-lg"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-adm-danger">
          <AlertTriangle size={18} />
        </div>
        <h3 className="mt-3 text-base font-semibold text-adm-text">{title}</h3>
        <p className="mt-1 text-sm text-adm-text-muted">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading} type="button">
            {loading ? "Working..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
