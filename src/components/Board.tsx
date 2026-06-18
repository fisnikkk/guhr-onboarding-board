"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { PHASE_ORDER } from "@/lib/constants";
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
} from "@/lib/board";
import { todayIso } from "@/lib/format";
import { createSeedBoard } from "@/lib/seed";
import { boardRepository, loadInitialBoard } from "@/lib/storage";
import { useT } from "@/components/LocaleProvider";
import { BoardHeader } from "@/components/BoardHeader";
import { Column } from "@/components/Column";
import { ClientCardView } from "@/components/ClientCard";
import { CardDetailModal } from "@/components/CardDetailModal";
import type {
  BoardFilters,
  BoardState,
  Card,
  CardDraft,
  PhaseId,
} from "@/lib/types";

const PHASE_SET = new Set<string>(PHASE_ORDER);

/** Which phase (container) an id belongs to: a phase id itself, or a card's phase. */
function containerOf(state: BoardState, id: string): PhaseId | null {
  if (PHASE_SET.has(id)) return id as PhaseId;
  const card = state.cards.find((c) => c.id === id);
  return card ? card.phase : null;
}

/**
 * Move a card into `overContainer` at the position implied by `overId` (a card id,
 * or the column id itself → append). Single source of truth for cross-column drops.
 */
function moveToContainer(
  state: BoardState,
  activeId: string,
  overContainer: PhaseId,
  overId: string,
): BoardState {
  const overItems = sortedPhaseCards(state.cards, overContainer);
  const newIndex = PHASE_SET.has(overId)
    ? overItems.length
    : Math.max(
        0,
        overItems.findIndex((c) => c.id === overId),
      );
  return moveCard(state, activeId, overContainer, newIndex);
}

/** Blank card template used to seed the "new client" modal. */
function blankCard(phase: PhaseId): Card {
  return {
    id: "new",
    clientName: "",
    email: "",
    phone: "",
    mandateType: "einkommensteuer",
    assigneeId: "",
    dateAdded: todayIso(),
    phase,
    priority: "normal",
    notes: "",
    order: 0,
  };
}

type Editing = { mode: "new" | "edit"; card: Card } | null;

export function Board() {
  const { t } = useT();

  // Deterministic seed for the first (server + hydration) render; persisted state
  // is loaded in an effect afterwards to avoid a hydration mismatch.
  const [board, setBoard] = useState<BoardState>(() =>
    normalizeBoard(createSeedBoard(), PHASE_ORDER),
  );
  const [filters, setFilters] = useState<BoardFilters>({
    search: "",
    mandateType: "all",
    assigneeId: "all",
  });
  const [editing, setEditing] = useState<Editing>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const hydrated = useRef(false);

  // Load persisted board on mount (deferred to an effect to avoid an SSR hydration mismatch).
  useEffect(() => {
    setBoard(loadInitialBoard());
  }, []);

  // Persist (debounced) after hydration. Skip the initial seed render: the load
  // effect above triggers exactly one re-render that flips `hydrated` to true.
  useEffect(() => {
    if (!hydrated.current) {
      hydrated.current = true;
      return;
    }
    const id = window.setTimeout(() => boardRepository.save(board), 250);
    return () => window.clearTimeout(id);
  }, [board]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
      // Space starts/ends a drag (Enter is reserved for opening the card).
      keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space"] },
    }),
  );

  // Derived groupings: filtered (shown) + unfiltered (for "hidden" counts).
  const filteredByPhase = useMemo(
    () => cardsByPhase(filterCards(board.cards, filters), PHASE_ORDER),
    [board.cards, filters],
  );
  const unfilteredByPhase = useMemo(
    () => cardsByPhase(board.cards, PHASE_ORDER),
    [board.cards],
  );
  const visibleCount = useMemo(
    () => filterCards(board.cards, filters).length,
    [board.cards, filters],
  );

  const activeCard = activeId
    ? board.cards.find((c) => c.id === activeId) ?? null
    : null;

  // ── Handlers ────────────────────────────────────────────────
  const handleFiltersChange = useCallback((patch: Partial<BoardFilters>) => {
    setFilters((f) => ({ ...f, ...patch }));
  }, []);

  const handleOpenCard = useCallback((card: Card) => {
    setEditing({ mode: "edit", card });
  }, []);

  const handleNewClient = useCallback(() => {
    setEditing({ mode: "new", card: blankCard("new_inquiry") });
  }, []);

  const handleAddCard = useCallback((draft: CardDraft) => {
    setBoard((prev) => addCard(prev, draft).state);
  }, []);

  const handleSaveCard = useCallback(
    (draft: CardDraft, id?: string) => {
      setBoard((prev) =>
        id ? updateCard(prev, id, draft) : addCard(prev, draft).state,
      );
      setEditing(null);
    },
    [],
  );

  const handleDeleteCard = useCallback((id: string) => {
    setBoard((prev) => deleteCard(prev, id));
    setEditing(null);
  }, []);

  const handleReset = useCallback(() => {
    if (!window.confirm(t.header.resetConfirm)) return;
    boardRepository.clear();
    setBoard(normalizeBoard(createSeedBoard(), PHASE_ORDER));
    setFilters({ search: "", mandateType: "all", assigneeId: "all" });
  }, [t.header.resetConfirm]);

  // ── Drag and drop ───────────────────────────────────────────
  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeIdStr = String(active.id);
    const overId = String(over.id);
    if (activeIdStr === overId) return;

    setBoard((prev) => {
      const activeContainer = containerOf(prev, activeIdStr);
      const overContainer = containerOf(prev, overId);
      if (
        !activeContainer ||
        !overContainer ||
        activeContainer === overContainer
      ) {
        return prev;
      }
      return moveToContainer(prev, activeIdStr, overContainer, overId);
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const activeIdStr = String(active.id);
    const overId = String(over.id);

    setBoard((prev) => {
      const activeContainer = containerOf(prev, activeIdStr);
      const overContainer = containerOf(prev, overId);
      if (!activeContainer || !overContainer) return prev;

      if (activeContainer === overContainer) {
        if (PHASE_SET.has(overId) || activeIdStr === overId) return prev;
        return reorderWithinPhase(prev, activeContainer, activeIdStr, overId);
      }

      return moveToContainer(prev, activeIdStr, overContainer, overId);
    });
  }

  return (
    <div className="flex h-screen flex-col bg-surface-alt">
      <BoardHeader
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={board.cards.length}
        visibleCount={visibleCount}
        onNewClient={handleNewClient}
        onReset={handleReset}
      />

      <DndContext
        id="guhr-onboarding-board"
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <main className="scrollbar-thin flex min-h-0 flex-1 gap-4 overflow-x-auto px-4 py-5 sm:px-6">
          {hasActiveFilters(filters) && visibleCount === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
              <p className="text-[15px] text-body">{t.board.noResults}</p>
              <button
                type="button"
                onClick={() =>
                  handleFiltersChange({
                    search: "",
                    mandateType: "all",
                    assigneeId: "all",
                  })
                }
                className="rounded-pill border border-line px-4 py-2 text-[13px] font-bold text-slate transition-colors hover:bg-surface-accent"
              >
                {t.header.clearFilters}
              </button>
            </div>
          ) : (
            PHASE_ORDER.map((phase) => (
              <Column
                key={phase}
                phase={phase}
                cards={filteredByPhase[phase]}
                totalInPhase={unfilteredByPhase[phase].length}
                onOpenCard={handleOpenCard}
                onAddCard={handleAddCard}
              />
            ))
          )}
        </main>

        <DragOverlay>
          {activeCard ? (
            <div className="w-[284px]">
              <ClientCardView card={activeCard} overlay />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {editing && (
        <CardDetailModal
          key={editing.card.id}
          mode={editing.mode}
          card={editing.card}
          onClose={() => setEditing(null)}
          onSave={handleSaveCard}
          onDelete={editing.mode === "edit" ? handleDeleteCard : undefined}
        />
      )}
    </div>
  );
}
