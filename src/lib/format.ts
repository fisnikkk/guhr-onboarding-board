/**
 * Formatting + id helpers. Pure and framework-agnostic.
 */

import type { Locale } from "./types";

/** Generate a stable unique id (uses crypto.randomUUID where available). */
export function generateId(prefix = "card"): string {
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `${prefix}-${uuid}`;
}

const DATE_LOCALE: Record<Locale, string> = {
  de: "de-DE",
  en: "en-GB",
};

/**
 * Format an ISO date (yyyy-mm-dd) for display, e.g. "16. Juni 2026" / "16 Jun 2026".
 * Parsed and formatted in UTC so the output is identical on the server and the
 * client regardless of timezone (prevents hydration mismatches on seeded cards).
 */
export function formatDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat(DATE_LOCALE[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Today's date as an ISO yyyy-mm-dd string (local time). */
export function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Derive uppercase initials (max 2) from a name. */
export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
