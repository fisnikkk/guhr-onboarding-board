/**
 * Small color utilities for data-driven styling (avatars, badges, dots).
 * Pure functions, no dependencies — safe to unit test or use anywhere.
 */

/** Parse a #rgb or #rrggbb hex string into [r, g, b] (0–255). */
function parseHex(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const int = parseInt(h, 16);
  if (Number.isNaN(int) || h.length !== 6) return [0, 0, 0];
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

/** Relative luminance (WCAG) of a hex color, 0 (black) – 1 (white). */
export function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio (1–21) between two hex colors. */
export function contrast(aHex: string, bHex: string): number {
  const l1 = luminance(aHex);
  const l2 = luminance(bHex);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

const DARK_TEXT = "#1a1a1a"; // soft black — gentler than pure #000 on gold
const LIGHT_TEXT = "#ffffff";

/**
 * Return the text color (dark or light) with the higher actual contrast against
 * the given background. Picking by real contrast — not a luminance threshold —
 * correctly gives the brand gold (#d0b578) dark text (8.8:1 vs 2.0:1 for white).
 */
export function getContrastText(bgHex: string): string {
  return contrast(bgHex, DARK_TEXT) >= contrast(bgHex, LIGHT_TEXT)
    ? DARK_TEXT
    : LIGHT_TEXT;
}

/** Append an alpha channel to a #rrggbb hex (alpha 0–1) → #rrggbbaa. */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
    .toString(16)
    .padStart(2, "0");
  const h = hex.replace("#", "");
  return `#${h.length === 3 ? h.split("").map((c) => c + c).join("") : h}${a}`;
}
