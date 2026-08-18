"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Card } from "./ui/card";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { markMessageRead, deleteMessage } from "@/lib/actions/admin/messages";
import type { ContactMessage } from "@/lib/types";

export function MessagesInbox({ items }: { items: ContactMessage[] }) {
  const [list, setList] = useState(items);
  const [deleting, setDeleting] = useState<ContactMessage | null>(null);
  const [, startTransition] = useTransition();

  function toggleRead(msg: ContactMessage) {
    setList((l) => l.map((m) => (m.id === msg.id ? { ...m, read: !m.read } : m)));
    startTransition(async () => {
      await markMessageRead(msg.id, !msg.read);
    });
  }

  function handleDelete() {
    if (!deleting) return;
    startTransition(async () => {
      const result = await deleteMessage(deleting.id);
      if (!result.ok) {
        toast.error(result.error || "Delete failed.");
        return;
      }
      setList((l) => l.filter((m) => m.id !== deleting.id));
      toast.success("Message deleted.");
      setDeleting(null);
    });
  }

  if (list.length === 0) {
    return (
      <Card className="flex flex-col items-center py-16 text-center">
        <Mail size={28} className="mb-2 text-adm-text-muted" />
        <p className="text-sm text-adm-text-muted">No messages yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {list.map((msg) => (
        <Card key={msg.id} className={`p-4 ${!msg.read ? "border-adm-accent/40" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                {!msg.read && <span className="h-2 w-2 rounded-full bg-adm-accent" />}
                <p className="text-sm font-semibold text-adm-text">{msg.name}</p>
                <span className="text-xs text-adm-text-muted">&lt;{msg.email}&gt;</span>
              </div>
              {msg.subject && (
                <p className="mt-0.5 text-sm font-medium text-adm-text">{msg.subject}</p>
              )}
            </div>
            <span className="text-xs text-adm-text-muted">
              {new Date(msg.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-adm-text-muted">{msg.message}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => toggleRead(msg)}
              className="flex items-center gap-1.5 rounded-lg border border-adm-border px-3 py-1.5 text-xs text-adm-text-muted hover:bg-adm-surface-2"
            >
              {msg.read ? <Mail size={12} /> : <MailOpen size={12} />}
              Mark as {msg.read ? "unread" : "read"}
            </button>
            <a
              href={`mailto:${msg.email}`}
              className="flex items-center gap-1.5 rounded-lg border border-adm-border px-3 py-1.5 text-xs text-adm-text-muted hover:bg-adm-surface-2"
            >
              Reply
            </a>
            <button
              type="button"
              onClick={() => setDeleting(msg)}
              className="flex items-center gap-1.5 rounded-lg border border-adm-border px-3 py-1.5 text-xs text-adm-text-muted hover:bg-red-50 hover:text-adm-danger"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </Card>
      ))}

      <ConfirmDialog
        open={!!deleting}
        title="Delete this message?"
        description="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
