/**
 * Persistence layer. The rest of the app depends only on the `BoardRepository`
 * interface, so swapping localStorage for a real backend (e.g. Supabase) later
 * means implementing one interface — no UI changes required.
 */

import {
  MANDATE_ORDER,
  PHASE_ORDER,
  PRIORITY_ORDER,
  SCHEMA_VERSION,
  STORAGE_KEY,
} from "./constants";
import { normalizeBoard } from "./board";
import { createSeedBoard } from "./seed";
import type { BoardState, Card } from "./types";

export interface BoardRepository {
  /** Return persisted state, or null if absent/invalid/outdated. */
  load(): BoardState | null;
  save(state: BoardState): void;
  /** Remove persisted state (used by "reset demo data"). */
  clear(): void;
}

const isBrowser = (): boolean =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const PHASE_SET = new Set<string>(PHASE_ORDER);
const MANDATE_SET = new Set<string>(MANDATE_ORDER);
const PRIORITY_SET = new Set<string>(PRIORITY_ORDER);

/**
 * Runtime validation so a corrupt/old payload falls back to seed. Enum fields are
 * checked against their known sets — not just `typeof string` — so a card with an
 * unknown phase/mandate/priority can't slip through and become an invisible,
 * still-counted "ghost" card.
 */
function isValidState(value: unknown): value is BoardState {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<BoardState>;
  if (v.version !== SCHEMA_VERSION) return false;
  if (!Array.isArray(v.cards)) return false;
  return v.cards.every(
    (c: Partial<Card>) =>
      typeof c?.id === "string" &&
      typeof c?.clientName === "string" &&
      typeof c?.phase === "string" &&
      PHASE_SET.has(c.phase) &&
      typeof c?.mandateType === "string" &&
      MANDATE_SET.has(c.mandateType) &&
      typeof c?.priority === "string" &&
      PRIORITY_SET.has(c.priority) &&
      typeof c?.order === "number" &&
      Number.isFinite(c.order),
  );
}

export class LocalStorageBoardRepository implements BoardRepository {
  constructor(private readonly key: string = STORAGE_KEY) {}

  load(): BoardState | null {
    if (!isBrowser()) return null;
    try {
      const raw = window.localStorage.getItem(this.key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return isValidState(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  save(state: BoardState): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(this.key, JSON.stringify(state));
    } catch {
      // Quota exceeded or storage disabled — fail silently; UI keeps working in-memory.
    }
  }

  clear(): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(this.key);
    } catch {
      /* no-op */
    }
  }
}

/** The repository instance the app uses. */
export const boardRepository: BoardRepository = new LocalStorageBoardRepository();

/**
 * Load the board for first render: persisted state if present and valid,
 * otherwise a fresh seed board. Always normalized so orders are dense.
 */
export function loadInitialBoard(repo: BoardRepository = boardRepository): BoardState {
  const persisted = repo.load();
  const base = persisted ?? createSeedBoard();
  return normalizeBoard(base, PHASE_ORDER);
}
