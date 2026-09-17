import { useSyncExternalStore } from "react";
import { pt } from "./pt";
import { en } from "./en";
export type Locale = "pt" | "en";
const listeners = new Set<() => void>();
const upperPt = Object.fromEntries(
  Object.entries(pt).map(([key, value]) => [
    key.toUpperCase(),
    value.toUpperCase(),
  ]),
);
const upperEn = Object.fromEntries(
  Object.entries(en).map(([key, value]) => [
    key.toUpperCase(),
    value.toUpperCase(),
  ]),
);
let locale: Locale = "pt";
try {
  if (localStorage.getItem("reine-locale") === "en") locale = "en";
} catch {
  /* Storage is optional. */
}
export function setLocale(next: Locale) {
  if (next === locale) return;
  locale = next;
  try {
    localStorage.setItem("reine-locale", next);
  } catch {
    /* Keep the live preference. */
  }
  listeners.forEach((notify) => notify());
}
export function useLocale() {
  return useSyncExternalStore(
    subscribe,
    () => locale,
    () => "pt" as Locale,
  );
}
function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}
export function t(text: string): string {
  const key = text.trim().replace(/\s+/g, " ");
  const dictionary = locale === "pt" ? pt : en;
  const translated = Object.hasOwn(dictionary, key)
    ? dictionary[key]
    : key === key.toUpperCase()
      ? (locale === "pt" ? upperPt : upperEn)[key]
      : undefined;
  if (translated === key) return text;
  if (translated !== undefined)
    return text.replace(text.trim(), () => translated);
  if (/^REINE · LV\.\d+\. Classe:/.test(text))
    return text.replace("Classe:", dictionary["Classe:"]);
  const prefixes = [
    "Imagem de ",
    "Screenshot de ",
    "Por que eu gosto: ",
    "Como comecei: ",
    "Para explorar: ",
  ];
  for (const prefix of prefixes)
    if (text.startsWith(prefix))
      return (
        (dictionary[prefix.trim()] ?? prefix.trim()) +
        " " +
        t(text.slice(prefix.length))
      );
  if (text.includes(": ")) {
    const split = text.indexOf(": ");
    return t(text.slice(0, split)) + ": " + t(text.slice(split + 2));
  }
  return text;
}
