import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Card } from "./card";

export function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  href?: string;
}) {
  const content = (
    <Card className="flex items-center gap-4 transition-colors hover:border-adm-accent/40">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-adm-accent-soft text-adm-accent">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-adm-text">{value}</p>
        <p className="text-xs text-adm-text-muted">{label}</p>
      </div>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
