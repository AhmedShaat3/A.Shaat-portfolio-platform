"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ShieldCheck, KeyRound } from "lucide-react";
import { Field, Input, Button } from "./ui/fields";
import { Card } from "./ui/card";
import { changePassword } from "@/lib/actions/admin/security";

export function SecuritySettings({ sessionCount }: { sessionCount: number }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (next !== confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    startTransition(async () => {
      const result = await changePassword(current, next);
      if (!result.ok) {
        toast.error(result.error || "Failed to change password.");
        return;
      }
      toast.success("Password updated. Other sessions were signed out.");
      setCurrent("");
      setNext("");
      setConfirm("");
    });
  }

  return (
    <div className="max-w-xl space-y-6">
      <Card>
        <div className="flex items-center gap-2 text-sm font-semibold text-adm-text">
          <ShieldCheck size={16} className="text-adm-accent" /> Account Security
        </div>
        <ul className="mt-3 space-y-1.5 text-sm text-adm-text-muted">
          <li>Passwords are hashed with bcrypt (never stored in plain text).</li>
          <li>5 failed login attempts locks the account for 15 minutes.</li>
          <li>Active sessions right now: {sessionCount}</li>
          <li>
            Two-factor authentication is architected (schema field exists) but not
            enforced in this build — see SETUP.md for how to complete it.
          </li>
        </ul>
      </Card>

      <Card>
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-adm-text">
          <KeyRound size={16} className="text-adm-accent" /> Change Password
        </div>
        <form onSubmit={submit} className="space-y-4">
          <Field label="Current Password" required>
            <Input
              type="password"
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              required
            />
          </Field>
          <Field label="New Password" hint="At least 8 characters, one uppercase letter, one number" required>
            <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} required />
          </Field>
          <Field label="Confirm New Password" required>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </Field>
          <Button type="submit" disabled={pending}>
            {pending ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
