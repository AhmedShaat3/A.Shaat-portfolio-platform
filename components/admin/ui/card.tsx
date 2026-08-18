import { cn } from "@/lib/utils/cn";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-adm-border bg-adm-surface p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}
