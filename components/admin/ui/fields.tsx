"use client";

import { cn } from "@/lib/utils/cn";

export function Field({
  label,
  hint,
  children,
  required,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-xs font-medium text-adm-text-muted">
        {label}
        {required && <span className="text-adm-danger">*</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-adm-text-muted">{hint}</span>}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-lg border border-adm-border bg-adm-surface-2 px-3 py-2 text-sm text-adm-text outline-none transition-colors focus:border-adm-accent",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full resize-y rounded-lg border border-adm-border bg-adm-surface-2 px-3 py-2 text-sm text-adm-text outline-none transition-colors focus:border-adm-accent",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-lg border border-adm-border bg-adm-surface-2 px-3 py-2 text-sm text-adm-text outline-none transition-colors focus:border-adm-accent",
        props.className
      )}
    />
  );
}

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5.5 h-6 w-10 shrink-0 rounded-full transition-colors",
          checked ? "bg-adm-accent" : "bg-adm-border"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked ? "translate-x-4.5 translate-x-[18px]" : "translate-x-0.5"
          )}
        />
      </button>
      {label && <span className="text-sm text-adm-text">{label}</span>}
    </label>
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const variants: Record<string, string> = {
    primary: "bg-adm-accent text-white hover:opacity-90",
    secondary:
      "border border-adm-border text-adm-text hover:bg-adm-surface-2",
    danger: "bg-adm-danger text-white hover:opacity-90",
    ghost: "text-adm-text-muted hover:bg-adm-surface-2",
  };
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
    />
  );
}
