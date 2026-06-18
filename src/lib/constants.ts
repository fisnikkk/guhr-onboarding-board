/**
 * Static board configuration: phases, mandate types, priorities, team roster,
 * and storage keys. Colors here are drawn from / harmonized with the verified
 * Guhr palette in `brand.ts` so every accent stays on-brand.
 */

import { BRAND } from "./brand";
import type {
  MandateTypeId,
  PhaseId,
  PriorityId,
  TeamMember,
} from "./types";

export const STORAGE_KEY = "guhr-onboarding-board";
export const LOCALE_STORAGE_KEY = "guhr-onboarding-locale";
/** Bump when the persisted shape changes; load() resets stale versions to seed. */
export const SCHEMA_VERSION = 1;

export interface PhaseConfig {
  id: PhaseId;
  /** Accent color (hex) for the column header bar + count badge. */
  accent: string;
}

/**
 * The seven onboarding phases in board order. The accent ramp moves from a neutral
 * slate (fresh lead) through the gold pipeline (peach "waiting" → gold "in review"
 * → ochre "contract out") to verified brand green (active), with gray for paused —
 * giving non-technical staff an at-a-glance sense of progress, all on-brand.
 */
export const PHASES: readonly PhaseConfig[] = [
  { id: "new_inquiry", accent: BRAND.slate },
  { id: "consultation_scheduled", accent: "#c0a463" },
  { id: "documents_requested", accent: BRAND.peach },
  { id: "documents_received", accent: BRAND.gold },
  { id: "engagement_letter_sent", accent: "#b8975a" },
  { id: "signed_active", accent: BRAND.success },
  { id: "on_hold", accent: BRAND.muted },
] as const;

export const PHASE_ORDER: readonly PhaseId[] = PHASES.map((p) => p.id);

export function getPhaseConfig(id: PhaseId): PhaseConfig {
  return PHASES.find((p) => p.id === id) ?? PHASES[0];
}

export interface MandateConfig {
  id: MandateTypeId;
  /** Soft tinted background for the badge. */
  bg: string;
  /** Readable foreground/text color for the badge. */
  fg: string;
}

/**
 * Muted, desaturated tints so the eight mandate badges read as one refined set
 * rather than a rainbow — in keeping with the restrained brand.
 */
export const MANDATE_TYPES: readonly MandateConfig[] = [
  { id: "einkommensteuer", bg: "#eef1f4", fg: "#4b5358" },
  { id: "gmbh", bg: "#efe7d6", fg: "#6f561f" },
  { id: "freelancer", bg: "#fbf2df", fg: "#8a6310" },
  { id: "gewerbe", bg: "#e8f1ec", fg: "#256340" },
  { id: "umsatzsteuer", bg: "#e8eef2", fg: "#3b6b86" },
  { id: "lohnbuchhaltung", bg: "#f1ecf4", fg: "#6b4e7d" },
  { id: "verein", bg: "#f3eee6", fg: "#6a5840" },
  { id: "sonstiges", bg: "#f0f0f0", fg: "#6b6b6b" },
] as const;

export const MANDATE_ORDER: readonly MandateTypeId[] = MANDATE_TYPES.map(
  (m) => m.id,
);

export function getMandateConfig(id: MandateTypeId): MandateConfig {
  return MANDATE_TYPES.find((m) => m.id === id) ?? MANDATE_TYPES[MANDATE_TYPES.length - 1];
}

export interface PriorityConfig {
  id: PriorityId;
  /** Dot color. */
  color: string;
}

export const PRIORITIES: readonly PriorityConfig[] = [
  { id: "normal", color: BRAND.muted },
  { id: "high", color: BRAND.gold },
  // A single restrained brick-red (the shared `danger` token), used for "Dringend"
  // plus validation/destructive UI. Deliberately the one hue outside the marketing palette.
  { id: "urgent", color: BRAND.danger },
] as const;

export const PRIORITY_ORDER: readonly PriorityId[] = PRIORITIES.map((p) => p.id);

export function getPriorityConfig(id: PriorityId): PriorityConfig {
  return PRIORITIES.find((p) => p.id === id) ?? PRIORITIES[0];
}

/** Seeded team roster. Avatar colors are harmonized brand tones. */
export const TEAM_MEMBERS: readonly TeamMember[] = [
  { id: "tm-sandra", name: "Sandra Guhr", initials: "SG", roleId: "partner", color: BRAND.gold },
  { id: "tm-michael", name: "Michael Vogt", initials: "MV", roleId: "tax_advisor", color: BRAND.slate },
  { id: "tm-julia", name: "Julia Brandt", initials: "JB", roleId: "tax_specialist", color: "#2f7d52" },
  { id: "tm-thomas", name: "Thomas Keller", initials: "TK", roleId: "tax_clerk", color: "#3b6b86" },
  { id: "tm-lena", name: "Lena Hoffmann", initials: "LH", roleId: "office", color: "#876b2c" },
  { id: "tm-daniel", name: "Daniel Roth", initials: "DR", roleId: "accountant", color: "#7d6a4e" },
] as const;

export function getTeamMember(id: string): TeamMember | undefined {
  return TEAM_MEMBERS.find((m) => m.id === id);
}
