import { describe, expect, it } from "vitest";
import {
  addCard,
  cardsByPhase,
  deleteCard,
  filterCards,
  hasActiveFilters,
  moveCard,
  normalizeBoard,
  reorderWithinPhase,
  sortedPhaseCards,
  updateCard,
} from "./board";
import { PHASE_ORDER } from "./constants";
import type { BoardState, Card, CardDraft, PhaseId } from "./types";

function makeCard(id: string, phase: PhaseId, order: number): Card {
  return {
    id,
    clientName: `Client ${id}`,
    email: `${id}@example.de`,
    phone: "+49 30 000000",
    mandateType: "einkommensteuer",
    assigneeId: "tm-michael",
    dateAdded: "2026-06-01",
    phase,
    priority: "normal",
    notes: "",
    order,
  };
}

function makeState(cards: Card[]): BoardState {
  return { version: 1, cards };
}

const draft: CardDraft = {
  clientName: "Neue Mandantin",
  email: "neu@example.de",
  phone: "+49 30 111111",
  mandateType: "gmbh",
  assigneeId: "",
  dateAdded: "2026-06-18",
  phase: "new_inquiry",
  priority: "high",
  notes: "Test",
};

describe("sortedPhaseCards", () => {
  it("returns only the phase's cards, sorted by order", () => {
    const state = makeState([
      makeCard("a", "new_inquiry", 2),
      makeCard("b", "new_inquiry", 0),
      makeCard("c", "on_hold", 0),
      makeCard("d", "new_inquiry", 1),
    ]);
    expect(sortedPhaseCards(state.cards, "new_inquiry").map((c) => c.id)).toEqual([
      "b",
      "d",
      "a",
    ]);
  });
});

describe("addCard", () => {
  it("appends to the end of the target phase with the next order", () => {
    const state = makeState([makeCard("a", "new_inquiry", 0)]);
    const { state: next, card } = addCard(state, draft);
    expect(next.cards).toHaveLength(2);
    expect(card.order).toBe(1);
    expect(card.phase).toBe("new_inquiry");
    expect(card.id).not.toBe("");
    expect(card.clientName).toBe("Neue Mandantin");
  });

  it("uses order 0 for the first card in an empty phase", () => {
    const { card } = addCard(makeState([]), { ...draft, phase: "on_hold" });
    expect(card.order).toBe(0);
  });
});

describe("updateCard", () => {
  it("patches editable fields in place", () => {
    const state = makeState([makeCard("a", "new_inquiry", 0)]);
    const next = updateCard(state, "a", { clientName: "Renamed", priority: "urgent" });
    expect(next.cards[0].clientName).toBe("Renamed");
    expect(next.cards[0].priority).toBe("urgent");
  });

  it("moves a card to the end of the new phase when phase changes", () => {
    const state = makeState([
      makeCard("a", "new_inquiry", 0),
      makeCard("b", "signed_active", 0),
      makeCard("c", "signed_active", 1),
    ]);
    const next = updateCard(state, "a", { phase: "signed_active" });
    const moved = next.cards.find((c) => c.id === "a")!;
    expect(moved.phase).toBe("signed_active");
    expect(moved.order).toBe(2);
  });
});

describe("deleteCard", () => {
  it("removes a card and renormalizes the remaining orders in its phase", () => {
    const state = makeState([
      makeCard("a", "new_inquiry", 0),
      makeCard("b", "new_inquiry", 1),
      makeCard("c", "new_inquiry", 2),
    ]);
    const next = deleteCard(state, "b");
    expect(next.cards).toHaveLength(2);
    expect(sortedPhaseCards(next.cards, "new_inquiry").map((c) => [c.id, c.order])).toEqual([
      ["a", 0],
      ["c", 1],
    ]);
  });
});

describe("moveCard", () => {
  it("moves a card across phases and densely reorders both phases", () => {
    const state = makeState([
      makeCard("a", "new_inquiry", 0),
      makeCard("b", "new_inquiry", 1),
      makeCard("c", "documents_requested", 0),
    ]);
    const next = moveCard(state, "a", "documents_requested", 0);
    expect(sortedPhaseCards(next.cards, "documents_requested").map((c) => c.id)).toEqual([
      "a",
      "c",
    ]);
    // Source phase renormalized to 0..n-1.
    expect(sortedPhaseCards(next.cards, "new_inquiry").map((c) => [c.id, c.order])).toEqual([
      ["b", 0],
    ]);
  });

  it("clamps an out-of-range index to the end", () => {
    const state = makeState([
      makeCard("a", "new_inquiry", 0),
      makeCard("b", "documents_requested", 0),
    ]);
    const next = moveCard(state, "a", "documents_requested", 99);
    expect(sortedPhaseCards(next.cards, "documents_requested").map((c) => c.id)).toEqual([
      "b",
      "a",
    ]);
  });

  it("is a no-op for an unknown card id", () => {
    const state = makeState([makeCard("a", "new_inquiry", 0)]);
    expect(moveCard(state, "ghost", "on_hold", 0)).toBe(state);
  });
});

describe("reorderWithinPhase", () => {
  it("reorders correctly regardless of direction (no off-by-one)", () => {
    const state = makeState([
      makeCard("a", "new_inquiry", 0),
      makeCard("b", "new_inquiry", 1),
      makeCard("c", "new_inquiry", 2),
    ]);
    // Move a down onto c → [b, c, a]
    const down = reorderWithinPhase(state, "new_inquiry", "a", "c");
    expect(sortedPhaseCards(down.cards, "new_inquiry").map((c) => c.id)).toEqual([
      "b",
      "c",
      "a",
    ]);
    // Move c up onto a → [c, a, b]
    const up = reorderWithinPhase(state, "new_inquiry", "c", "a");
    expect(sortedPhaseCards(up.cards, "new_inquiry").map((c) => c.id)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });
});

describe("filterCards", () => {
  const cards = [
    { ...makeCard("a", "new_inquiry", 0), clientName: "Bäckerei Hofmann", mandateType: "gmbh" as const, assigneeId: "tm-lena" },
    { ...makeCard("b", "new_inquiry", 1), clientName: "Sophie Wagner", mandateType: "einkommensteuer" as const, assigneeId: "tm-julia" },
    { ...makeCard("c", "on_hold", 0), clientName: "Café Solera", notes: "USt dringend", assigneeId: "" },
  ];

  it("matches search against name, email, and notes", () => {
    expect(filterCards(cards, { search: "hofmann", mandateType: "all", assigneeId: "all" }).map((c) => c.id)).toEqual(["a"]);
    expect(filterCards(cards, { search: "ust", mandateType: "all", assigneeId: "all" }).map((c) => c.id)).toEqual(["c"]);
  });

  it("filters by mandate type and assignee (including unassigned)", () => {
    expect(filterCards(cards, { search: "", mandateType: "gmbh", assigneeId: "all" }).map((c) => c.id)).toEqual(["a"]);
    expect(filterCards(cards, { search: "", mandateType: "all", assigneeId: "" }).map((c) => c.id)).toEqual(["c"]);
  });

  it("combines filters (AND)", () => {
    expect(
      filterCards(cards, { search: "café", mandateType: "all", assigneeId: "tm-julia" }),
    ).toHaveLength(0);
  });
});

describe("hasActiveFilters", () => {
  it("detects active filters", () => {
    expect(hasActiveFilters({ search: "", mandateType: "all", assigneeId: "all" })).toBe(false);
    expect(hasActiveFilters({ search: "x", mandateType: "all", assigneeId: "all" })).toBe(true);
    expect(hasActiveFilters({ search: "", mandateType: "gmbh", assigneeId: "all" })).toBe(true);
  });
});

describe("normalizeBoard", () => {
  it("makes every phase's orders dense 0..n-1", () => {
    const state = makeState([
      makeCard("a", "new_inquiry", 5),
      makeCard("b", "new_inquiry", 9),
      makeCard("c", "signed_active", 3),
    ]);
    const next = normalizeBoard(state, PHASE_ORDER);
    expect(sortedPhaseCards(next.cards, "new_inquiry").map((c) => c.order)).toEqual([0, 1]);
    expect(sortedPhaseCards(next.cards, "signed_active").map((c) => c.order)).toEqual([0]);
  });
});

describe("cardsByPhase", () => {
  it("groups all phases, including empty ones", () => {
    const grouped = cardsByPhase([makeCard("a", "new_inquiry", 0)], PHASE_ORDER);
    expect(Object.keys(grouped)).toHaveLength(PHASE_ORDER.length);
    expect(grouped.new_inquiry.map((c) => c.id)).toEqual(["a"]);
    expect(grouped.on_hold).toEqual([]);
  });
});
