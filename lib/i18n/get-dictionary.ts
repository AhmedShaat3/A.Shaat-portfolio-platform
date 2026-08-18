import type { Locale } from "./config";
import en from "./dictionaries/en";
import ar from "./dictionaries/ar";

const dictionaries = { en, ar };

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.en;
}
