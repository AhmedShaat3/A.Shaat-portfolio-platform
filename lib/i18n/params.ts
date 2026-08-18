import { notFound } from "next/navigation";
import { isLocale, type Locale } from "./config";

export function resolveLocale(raw: string): Locale {
  if (!isLocale(raw)) notFound();
  return raw;
}
