import * as Icons from "lucide-react";
import type { LucideProps } from "lucide-react";

function toPascalCase(kebab: string) {
  return kebab
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

/** Resolve a lucide-react icon component from a stored kebab-case name (e.g. "shield-alert"). */
export function resolveIcon(name: string | null | undefined) {
  if (!name) return Icons.Circle;
  const pascal = toPascalCase(name);
  const Icon = (Icons as unknown as Record<string, React.ComponentType<LucideProps>>)[
    pascal
  ];
  return Icon ?? Icons.Circle;
}
