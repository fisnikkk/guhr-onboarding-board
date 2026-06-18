"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, GripVertical, Mail, Phone } from "lucide-react";
import { getTeamMember } from "@/lib/constants";
import { formatDate } from "@/lib/format";
import { useT } from "@/components/LocaleProvider";
import { Avatar } from "@/components/ui/Avatar";
import { MandateBadge } from "@/components/ui/MandateBadge";
import { PriorityDot } from "@/components/ui/PriorityDot";
import type { Card } from "@/lib/types";

/**
 * Presentational card. Used both inside a column (wrapped by SortableClientCard)
 * and inside the drag overlay (`overlay` = true), so it stays purely visual.
 */
export function ClientCardView({
  card,
  overlay = false,
}: {
  card: Card;
  overlay?: boolean;
}) {
  const { t, locale } = useT();
  const member = getTeamMember(card.assigneeId);
  const assigneeTitle = member
    ? `${member.name} · ${t.roles[member.roleId]}`
    : t.misc.unassigned;

  return (
    <article
      className={`rounded-card border bg-surface p-3.5 transition-colors ${
        overlay
          ? "border-brand shadow-elevated rotate-[1.5deg] cursor-grabbing"
          : "border-line shadow-card hover:border-brand"
      }`}
    >
      {/* Top row: mandate badge + priority dot + drag affordance */}
      <div className="mb-2 flex items-center justify-between gap-2">
        <MandateBadge
          mandateType={card.mandateType}
          label={t.mandates[card.mandateType]}
        />
        <div className="flex items-center gap-1.5">
          <PriorityDot
            priority={card.priority}
            label={t.priorities[card.priority]}
          />
          {!overlay && (
            <GripVertical
              size={15}
              className="text-line-mid opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
          )}
        </div>
      </div>

      {/* Client name */}
      <h3 className="mb-2 text-[15px] font-bold leading-snug text-ink">
        {card.clientName}
      </h3>

      {/* Contact details (rows hidden when empty, e.g. just-added cards) */}
      {(card.email.trim() || card.phone.trim()) && (
        <div className="space-y-1 text-[12px] text-body">
          {card.email.trim() && (
            <div className="flex items-center gap-1.5">
              <Mail size={13} className="shrink-0 text-muted" aria-hidden />
              <span className="truncate">{card.email}</span>
            </div>
          )}
          {card.phone.trim() && (
            <div className="flex items-center gap-1.5">
              <Phone size={13} className="shrink-0 text-muted" aria-hidden />
              <span className="truncate">{card.phone}</span>
            </div>
          )}
        </div>
      )}

      {/* Notes preview */}
      {card.notes.trim() && (
        <p className="mt-2 line-clamp-2 text-[12px] italic leading-snug text-slate">
          {card.notes}
        </p>
      )}

      {/* Footer: assignee + date added */}
      <div className="mt-3 flex items-center justify-between border-t border-line-light pt-2.5">
        <Avatar member={member} size={26} title={assigneeTitle} />
        <span className="flex items-center gap-1 text-[11px] text-muted">
          <CalendarDays size={12} aria-hidden />
          {formatDate(card.dateAdded, locale)}
        </span>
      </div>
    </article>
  );
}

/**
 * Sortable, clickable card for use inside a column. A pointer movement of <6px
 * (set on the sensor) counts as a click → opens the detail modal; more than that
 * starts a drag.
 */
export function SortableClientCard({
  card,
  onOpen,
}: {
  card: Card;
  onOpen: (card: Card) => void;
}) {
  const { t } = useT();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  // Rich accessible name so screen-reader users get the card's key facts, not just the name.
  const member = getTeamMember(card.assigneeId);
  const assignee = member ? member.name : t.misc.unassigned;
  const ariaLabel = `${card.clientName} — ${t.mandates[card.mandateType]}, ${t.priorities[card.priority]}, ${assignee}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(card)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onOpen(card);
          return;
        }
        // Delegate other keys (Space to pick up, arrows to move) to the dnd-kit
        // KeyboardSensor — our explicit onKeyDown would otherwise clobber it.
        listeners?.onKeyDown?.(e);
      }}
      aria-label={ariaLabel}
      className="group block cursor-grab touch-none rounded-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate focus-visible:ring-offset-2 active:cursor-grabbing"
    >
      <ClientCardView card={card} />
    </div>
  );
}
