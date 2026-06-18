/**
 * Domain types for the Guhr onboarding board.
 *
 * These types are the single source of truth shared by the storage layer, the
 * pure board reducer, the seed data, and every UI component.
 */

export type Locale = "de" | "en";

/** The seven onboarding phases, in board order. */
export type PhaseId =
  | "new_inquiry"
  | "consultation_scheduled"
  | "documents_requested"
  | "documents_received"
  | "engagement_letter_sent"
  | "signed_active"
  | "on_hold";

/** Type of mandate (Mandatsart) a client engages the firm for. */
export type MandateTypeId =
  | "einkommensteuer"
  | "gmbh"
  | "freelancer"
  | "gewerbe"
  | "umsatzsteuer"
  | "lohnbuchhaltung"
  | "verein"
  | "sonstiges";

/** Priority / status indicator shown as a colored dot on each card. */
export type PriorityId = "normal" | "high" | "urgent";

/** Role of a team member, used as an i18n key. */
export type RoleId =
  | "partner"
  | "tax_advisor"
  | "tax_specialist"
  | "tax_clerk"
  | "accountant"
  | "office";

export interface TeamMember {
  id: string;
  name: string;
  /** Pre-computed initials for the avatar (e.g. "SG"). */
  initials: string;
  roleId: RoleId;
  /** Avatar background color (hex). Text color is derived for contrast. */
  color: string;
}

/** A single client card on the board. */
export interface Card {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  mandateType: MandateTypeId;
  /** TeamMember.id, or "" when unassigned. */
  assigneeId: string;
  /** ISO date string (yyyy-mm-dd) the card was added. */
  dateAdded: string;
  phase: PhaseId;
  priority: PriorityId;
  /** Free-text notes / next steps. */
  notes: string;
  /** Sort position within the card's current phase (ascending). */
  order: number;
}

/** The persisted board state. `version` enables forward-compatible migrations. */
export interface BoardState {
  version: number;
  cards: Card[];
}

/** Fields a user can edit on a card (everything except the immutable id). */
export type CardDraft = Omit<Card, "id" | "order">;

/** Active header filters. */
export interface BoardFilters {
  /** Free-text query; empty string means no search filter. */
  search: string;
  /** "all" means no filter. */
  mandateType: MandateTypeId | "all";
  /** "all" = no filter, "" = only unassigned cards, otherwise a TeamMember.id. */
  assigneeId: string;
}
