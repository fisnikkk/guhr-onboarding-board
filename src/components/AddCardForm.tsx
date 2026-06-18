"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { MANDATE_ORDER } from "@/lib/constants";
import { todayIso } from "@/lib/format";
import { useT } from "@/components/LocaleProvider";
import type { CardDraft, MandateTypeId, PhaseId } from "@/lib/types";

/**
 * Inline "add a card" affordance shown at the bottom of every column. Collapsed
 * it's a quiet button; expanded it's a minimal quick-add (name + mandate type).
 * Full details can be filled in afterwards via the card's detail modal.
 */
export function AddCardForm({
  phase,
  onAdd,
}: {
  phase: PhaseId;
  onAdd: (draft: CardDraft) => void;
}) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [mandateType, setMandateType] = useState<MandateTypeId>("einkommensteuer");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function reset() {
    setName("");
    setMandateType("einkommensteuer");
    setOpen(false);
  }

  function submit() {
    const clientName = name.trim();
    if (!clientName) {
      inputRef.current?.focus();
      return;
    }
    onAdd({
      clientName,
      email: "",
      phone: "",
      mandateType,
      assigneeId: "",
      dateAdded: todayIso(),
      phase,
      priority: "normal",
      notes: "",
    });
    // Keep the form open for rapid multi-entry, just clear the name.
    setName("");
    inputRef.current?.focus();
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-1.5 rounded-card border border-dashed border-line-mid py-2 text-[13px] font-bold text-slate transition-colors hover:border-brand hover:bg-brand-soft hover:text-brand"
      >
        <Plus size={15} aria-hidden />
        {t.actions.addCard}
      </button>
    );
  }

  return (
    <div className="rounded-card border border-brand bg-surface p-3 shadow-card">
      <input
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submit();
          } else if (e.key === "Escape") {
            e.preventDefault();
            reset();
          }
        }}
        placeholder={t.misc.quickAddPlaceholder}
        className="w-full rounded-sm border border-line bg-surface px-2.5 py-2 text-[14px] text-ink outline-none placeholder:text-muted focus:border-brand focus-visible:ring-2 focus-visible:ring-slate"
        aria-label={t.fields.clientName}
      />
      <select
        value={mandateType}
        onChange={(e) => setMandateType(e.target.value as MandateTypeId)}
        className="mt-2 w-full rounded-sm border border-line bg-surface px-2.5 py-2 text-[13px] text-ink outline-none focus:border-brand focus-visible:ring-2 focus-visible:ring-slate"
        aria-label={t.fields.mandateType}
      >
        {MANDATE_ORDER.map((id) => (
          <option key={id} value={id}>
            {t.mandates[id]}
          </option>
        ))}
      </select>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={submit}
          className="flex-1 rounded-pill bg-brand px-4 py-2 text-[13px] font-bold text-ink shadow-card transition-colors hover:bg-brand-dark"
        >
          {t.actions.addCard}
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label={t.actions.cancel}
          className="rounded-pill border border-line p-2 text-slate transition-colors hover:border-line-mid hover:bg-surface-accent"
        >
          <X size={16} aria-hidden />
        </button>
      </div>
    </div>
  );
}
