/**
 * Guhr Steuerberatung brand tokens.
 *
 * VERIFIED from the live guhr-steuerberatung.de Elementor "Kit-8" global CSS and
 * the firm's Logo.svg (2026-06-18). These are exposed as JS constants (in addition
 * to the Tailwind `@theme` tokens in globals.css) so that data-driven inline styles
 * — phase accents, mandate badges, avatars — can reference the exact same palette.
 *
 * The brand is intentionally minimal: a single gold accent on white, Lato type,
 * soft 10px-radius cards, no gradients.
 */

export const BRAND = {
  /** Primary gold/tan — the one accent (logo, buttons, links, active states). */
  gold: "#d0b578",
  /** Gold, darkened ~8% for hover/pressed states (inferred — not in source CSS). */
  goldDark: "#c4a55f",
  /** Very light gold tint for selected/hover surfaces. */
  goldSoft: "#f4eee1",
  /** Headings. */
  ink: "#000000",
  /** Dark slate — alternate heading/label tone. */
  slate: "#5b6165",
  /** Body / muted text (darkened slightly from the site's #797979 to clear WCAG AA). */
  body: "#6b6b6b",
  /** Page + card background. */
  white: "#ffffff",
  /** Alternate section background (the board canvas). */
  surfaceAlt: "#f5f5f5",
  /** Accent surface / ghost-button background. */
  surfaceAccent: "#f2f2f2",
  /** Divider / border. */
  line: "#dfdfdf",
  lineLight: "#e5e5e5",
  lineMid: "#d1d1d1",
  /** Muted gray (disabled, paused). */
  muted: "#a0a0a0",
  /** Verified brand green — reused for the "Active" phase + success. */
  success: "#15be7d",
  /** Verified peach (page-transition accent) — used sparingly. */
  peach: "#ffbc7d",
  /** Functional brick-red — "urgent" priority, validation errors, destructive actions. */
  danger: "#c0563b",
} as const;

export type BrandColor = keyof typeof BRAND;
