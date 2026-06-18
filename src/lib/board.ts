/**
 * Pure board state operations. No React, no storage, no side effects — every
 * function takes the current `BoardState` and returns a new one. This is the
 * unit-tested core (see board.test.ts); the UI is a thin layer over it.
 */

import { generateId } from "./format";
import type {
  BoardFilters,
  BoardState,
  Card,
  CardDraft,
  PhaseId,
} from "./types";

/** Cards in a phase, sorted by their `order`. */
export function sortedPhaseCards(cards: readonly Card[], phase: PhaseId): Card[] {
  return cards
    .filter((c) => c.phase === phase)
    .sort((a, b) => a.order - b.order);
}

/** All cards grouped by phase and sorted. */
export function cardsByPhase(
  cards: readonly Card[],
  phaseOrder: readonly PhaseId[],
): Record<PhaseId, Card[]> {
  const out = {} as Record<PhaseId, Card[]>;
  for (const phase of phaseOrder) out[phase] = sortedPhaseCards(cards, phase);
  return out;
}

/** Next order value (append to end) for a phase. */
function nextOrder(cards: readonly Card[], phase: PhaseId): number {
  const inPhase = cards.filter((c) => c.phase === phase);
  return inPhase.length
    ? Math.max(...inPhase.map((c) => c.order)) + 1
    : 0;
}

/** Add a new card to the end of its phase. Returns the new state and the card. */
export function addCard(
  state: BoardState,
  draft: CardDraft,
): { state: BoardState; card: Card } {
  const card: Card = {
    ...draft,
    id: generateId(),
    order: nextOrder(state.cards, draft.phase),
  };
  return { state: { ...state, cards: [...state.cards, card] }, card };
}

/**
 * Patch a card's editable fields. If the phase changes, the card is appended to
 * the end of the new phase (so a manual phase change behaves like a drop there).
 */
export function updateCard(
  state: BoardState,
  id: string,
  patch: Partial<CardDraft>,
): BoardState {
  const cards = state.cards.map((c) => {
    if (c.id !== id) return c;
    const next: Card = { ...c, ...patch };
    if (patch.phase && patch.phase !== c.phase) {
      next.order = nextOrder(
        state.cards.filter((x) => x.id !== id),
        patch.phase,
      );
    }
    return next;
  });
  return { ...state, cards };
}

/** Remove a card and renormalize the remaining orders in its phase. */
export function deleteCard(state: BoardState, id: string): BoardState {
  const removed = state.cards.find((c) => c.id === id);
  const cards = state.cards.filter((c) => c.id !== id);
  return removed
    ? { ...state, cards: renormalizePhase(cards, removed.phase) }
    : state;
}

/**
 * Move a card to `toPhase` at position `toIndex` (the drag-and-drop primitive).
 * Reassigns dense 0..n-1 orders for the target phase, and for the source phase
 * when the move crosses columns. `toIndex` is clamped into range.
 */
export function moveCard(
  state: BoardState,
  cardId: string,
  toPhase: PhaseId,
  toIndex: number,
): BoardState {
  const moving = state.cards.find((c) => c.id === cardId);
  if (!moving) return state;

  const targetList = sortedPhaseCards(state.cards, toPhase).filter(
    (c) => c.id !== cardId,
  );
  const index = Math.max(0, Math.min(toIndex, targetList.length));
  targetList.splice(index, 0, moving);

  const sourcePhase = moving.phase;
  const sourceList =
    sourcePhase === toPhase
      ? null
      : sortedPhaseCards(state.cards, sourcePhase).filter(
          (c) => c.id !== cardId,
        );

  const byId = new Map(state.cards.map((c) => [c.id, c] as const));
  targetList.forEach((c, i) =>
    byId.set(c.id, { ...c, phase: toPhase, order: i }),
  );
  sourceList?.forEach((c, i) => byId.set(c.id, { ...c, order: i }));

  return { ...state, cards: Array.from(byId.values()) };
}

/** Move an item within an array from one index to another (pure). */
function arrayMove<T>(arr: readonly T[], from: number, to: number): T[] {
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

/**
 * Reorder a card within its own phase so that it lands at `overId`'s position
 * (drag-and-drop within a column). Uses array-move semantics, so there is no
 * off-by-one regardless of drag direction.
 */
export function reorderWithinPhase(
  state: BoardState,
  phase: PhaseId,
  activeId: string,
  overId: string,
): BoardState {
  const ids = sortedPhaseCards(state.cards, phase).map((c) => c.id);
  const from = ids.indexOf(activeId);
  const to = ids.indexOf(overId);
  if (from === -1 || to === -1 || from === to) return state;
  const newIds = arrayMove(ids, from, to);
  const orderMap = new Map(newIds.map((id, i) => [id, i] as const));
  return {
    ...state,
    cards: state.cards.map((c) =>
      orderMap.has(c.id) ? { ...c, order: orderMap.get(c.id)! } : c,
    ),
  };
}

/** Renormalize a single phase's orders to a dense 0..n-1 sequence. */
function renormalizePhase(cards: Card[], phase: PhaseId): Card[] {
  const ordered = sortedPhaseCards(cards, phase);
  const orderMap = new Map(ordered.map((c, i) => [c.id, i] as const));
  return cards.map((c) =>
    orderMap.has(c.id) ? { ...c, order: orderMap.get(c.id)! } : c,
  );
}

/** Renormalize every phase — used defensively after loading persisted state. */
export function normalizeBoard(
  state: BoardState,
  phaseOrder: readonly PhaseId[],
): BoardState {
  let cards = state.cards;
  for (const phase of phaseOrder) cards = renormalizePhase(cards, phase);
  return { ...state, cards };
}

/**
 * Derived view: filter cards by the active header filters. Pure — never mutates.
 * Search matches client name, email, and notes (case-insensitive).
 */
export function filterCards(
  cards: readonly Card[],
  filters: BoardFilters,
): Card[] {
  const q = filters.search.trim().toLowerCase();
  return cards.filter((c) => {
    if (filters.mandateType !== "all" && c.mandateType !== filters.mandateType) {
      return false;
    }
    if (filters.assigneeId !== "all" && c.assigneeId !== filters.assigneeId) {
      return false;
    }
    if (q) {
      const haystack =
        `${c.clientName} ${c.email} ${c.notes}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

/** True when any filter is active. */
export function hasActiveFilters(filters: BoardFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.mandateType !== "all" ||
    filters.assigneeId !== "all"
  );
}
