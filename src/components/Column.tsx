"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { getPhaseConfig } from "@/lib/constants";
import { BRAND } from "@/lib/brand";
import { withAlpha } from "@/lib/colors";
import { useT } from "@/components/LocaleProvider";
import { SortableClientCard } from "@/components/ClientCard";
import { AddCardForm } from "@/components/AddCardForm";
import type { Card, CardDraft, PhaseId } from "@/lib/types";

/**
 * A single phase column: accent header with live count, a scrollable list of
 * sortable cards (a droppable target even when empty), an empty/filtered state,
 * and an inline add-card form.
 */
export function Column({
  phase,
  cards,
  totalInPhase,
  onOpenCard,
  onAddCard,
}: {
  phase: PhaseId;
  /** Cards after filtering (what is shown). */
  cards: Card[];
  /** Unfiltered count, to show "x hidden by filters". */
  totalInPhase: number;
  onOpenCard: (card: Card) => void;
  onAddCard: (draft: CardDraft) => void;
}) {
  const { t } = useT();
  const config = getPhaseConfig(phase);
  const { setNodeRef, isOver } = useDroppable({ id: phase });
  const hiddenCount = totalInPhase - cards.length;

  return (
    <section className="flex w-[300px] shrink-0 flex-col" aria-label={t.phases[phase]}>
      {/* Header */}
      <div className="mb-2.5 px-0.5">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: config.accent }}
            aria-hidden
          />
          <h2 className="flex-1 truncate text-[13px] font-bold uppercase tracking-wide text-slate">
            {t.phases[phase]}
          </h2>
          <span
            className="rounded-full px-2 py-0.5 text-[11px] font-bold"
            style={{
              backgroundColor: withAlpha(config.accent, 0.18),
              color: BRAND.slate,
            }}
          >
            {cards.length}
          </span>
        </div>
        <p className="mt-1 truncate pl-[18px] text-[11px] text-muted">
          {t.phaseHints[phase]}
        </p>
      </div>

      {/* Card list — droppable, scrollable */}
      <div
        ref={setNodeRef}
        className={`scrollbar-thin flex min-h-[120px] flex-1 flex-col gap-2.5 overflow-y-auto rounded-card border border-dashed p-2 transition-colors ${
          isOver ? "border-brand bg-brand-soft/60" : "border-transparent"
        }`}
        style={{ maxHeight: "100%" }}
      >
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <SortableClientCard key={card.id} card={card} onOpen={onOpenCard} />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-card px-3 py-6 text-center text-[12px] text-muted">
            {hiddenCount > 0
              ? `${hiddenCount} ${t.board.filteredOut}`
              : t.board.emptyColumn}
          </div>
        )}

        {hiddenCount > 0 && cards.length > 0 && (
          <p className="px-1 text-center text-[11px] text-muted">
            +{hiddenCount} {t.board.filteredOut}
          </p>
        )}
      </div>

      {/* Add card */}
      <div className="mt-2.5">
        <AddCardForm phase={phase} onAdd={onAddCard} />
      </div>
    </section>
  );
}
