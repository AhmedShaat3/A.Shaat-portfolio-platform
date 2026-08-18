"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from "lucide-react";
import { Button } from "./fields";
import { ConfirmDialog } from "./confirm-dialog";
import { Card } from "./card";

export interface ManagerAction<T> {
  create: (input: unknown) => Promise<{ ok: boolean; error?: string; data?: { id: string } }>;
  update: (id: string, input: unknown) => Promise<{ ok: boolean; error?: string }>;
  remove: (id: string) => Promise<{ ok: boolean; error?: string }>;
  reorder?: (orderedIds: string[]) => Promise<{ ok: boolean; error?: string }>;
}

export function EntityManager<T extends { id: string; order?: number; visible?: boolean }>({
  items,
  actions,
  renderItem,
  renderForm,
  emptyDefaults,
  entityLabel,
  toRow,
}: {
  items: T[];
  actions: ManagerAction<T>;
  renderItem: (item: T) => { title: string; subtitle?: string };
  renderForm: (
    value: Partial<T>,
    setValue: (v: Partial<T>) => void
  ) => React.ReactNode;
  emptyDefaults: Partial<T>;
  entityLabel: string;
  toRow?: (value: Partial<T>) => unknown;
}) {
  const [list, setList] = useState(items);
  const [editing, setEditing] = useState<Partial<T> | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [pending, startTransition] = useTransition();

  function openCreate() {
    setEditing({ ...emptyDefaults });
  }

  function openEdit(item: T) {
    setEditing({ ...item });
  }

  function handleSave() {
    if (!editing) return;
    const payload = toRow ? toRow(editing) : editing;
    startTransition(async () => {
      const isNew = !("id" in editing) || !editing.id;
      const result = isNew
        ? await actions.create(payload)
        : await actions.update((editing as T).id, payload);

      if (!result.ok) {
        toast.error(result.error || "Something went wrong.");
        return;
      }
      toast.success(isNew ? `${entityLabel} created.` : `${entityLabel} updated.`);
      setEditing(null);
      // Optimistic-ish: simplest reliable approach is a full reload of this
      // route's data via router refresh, but since these are server actions
      // that already revalidatePath, a soft reload keeps this component simple.
      window.location.reload();
    });
  }

  function handleDelete() {
    if (!deleting) return;
    startTransition(async () => {
      const result = await actions.remove(deleting.id);
      if (!result.ok) {
        toast.error(result.error || "Delete failed.");
        return;
      }
      toast.success(`${entityLabel} deleted.`);
      setList((l) => l.filter((i) => i.id !== deleting.id));
      setDeleting(null);
    });
  }

  function move(index: number, direction: -1 | 1) {
    if (!actions.reorder) return;
    const next = [...list];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setList(next);
    startTransition(async () => {
      const result = await actions.reorder!(next.map((i) => i.id));
      if (!result.ok) toast.error(result.error || "Reorder failed.");
    });
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate} type="button">
          <Plus size={15} /> Add {entityLabel}
        </Button>
      </div>

      {list.length === 0 ? (
        <Card className="flex flex-col items-center py-12 text-center">
          <p className="text-sm text-adm-text-muted">No {entityLabel.toLowerCase()}s yet.</p>
          <Button onClick={openCreate} variant="secondary" className="mt-3" type="button">
            <Plus size={15} /> Add your first {entityLabel.toLowerCase()}
          </Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {list.map((item, index) => {
            const { title, subtitle } = renderItem(item);
            return (
              <Card key={item.id} className="flex items-center gap-3 p-3">
                {actions.reorder && (
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="flex h-6 w-6 items-center justify-center rounded text-adm-text-muted hover:bg-adm-surface-2 disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === list.length - 1}
                      className="flex h-6 w-6 items-center justify-center rounded text-adm-text-muted hover:bg-adm-surface-2 disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-adm-text">{title}</p>
                  {subtitle && (
                    <p className="truncate text-xs text-adm-text-muted">{subtitle}</p>
                  )}
                </div>
                {"visible" in item && (
                  <span
                    className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                      item.visible
                        ? "bg-emerald-50 text-adm-success"
                        : "bg-gray-100 text-adm-text-muted"
                    }`}
                  >
                    {item.visible ? <Eye size={11} /> : <EyeOff size={11} />}
                    {item.visible ? "Visible" : "Hidden"}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-adm-text-muted hover:bg-adm-surface-2"
                  aria-label="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(item)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-adm-text-muted hover:bg-red-50 hover:text-adm-danger"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </Card>
            );
          })}
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setEditing(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-adm-border bg-adm-surface p-6 shadow-lg"
          >
            <h3 className="mb-4 text-base font-semibold text-adm-text">
              {("id" in editing && editing.id) ? `Edit ${entityLabel}` : `Add ${entityLabel}`}
            </h3>
            <div className="space-y-4">{renderForm(editing, setEditing)}</div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" type="button" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSave} disabled={pending}>
                {pending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleting}
        title={`Delete this ${entityLabel.toLowerCase()}?`}
        description="This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        loading={pending}
      />
    </div>
  );
}
