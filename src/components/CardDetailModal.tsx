"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2, X } from "lucide-react";
import {
  MANDATE_ORDER,
  PHASE_ORDER,
  PRIORITY_ORDER,
  TEAM_MEMBERS,
} from "@/lib/constants";
import { useT } from "@/components/LocaleProvider";
import type { Card, CardDraft } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "w-full rounded-sm border border-line bg-surface px-3 py-2 text-[14px] text-ink outline-none transition-colors placeholder:text-muted focus:border-brand focus-visible:ring-2 focus-visible:ring-slate";
const labelClass = "mb-1 block text-[12px] font-bold text-slate";

/**
 * Modal for creating a new client or editing an existing one. Holds a local draft
 * and only commits on Save. Accessible: role=dialog, focus trap, ESC + backdrop
 * close, body scroll lock.
 */
export function CardDetailModal({
  mode,
  card,
  onClose,
  onSave,
  onDelete,
}: {
  mode: "new" | "edit";
  card: Card;
  onClose: () => void;
  onSave: (draft: CardDraft, id?: string) => void;
  onDelete?: (id: string) => void;
}) {
  const { t } = useT();
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const [draft, setDraft] = useState<CardDraft>({
    clientName: card.clientName,
    email: card.email,
    phone: card.phone,
    mandateType: card.mandateType,
    assigneeId: card.assigneeId,
    dateAdded: card.dateAdded,
    phase: card.phase,
    priority: card.priority,
    notes: card.notes,
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  function set<K extends keyof CardDraft>(key: K, value: CardDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  // Has the user changed anything? (For "new", the card is a blank template,
  // so any entered value counts as dirty.)
  const isDirty = useMemo(
    () => (Object.keys(draft) as (keyof CardDraft)[]).some((k) => draft[k] !== card[k]),
    [draft, card],
  );

  // Guard every dismissal path: confirm before discarding unsaved edits.
  function requestClose() {
    if (!isDirty || window.confirm(t.detail.unsaved)) onClose();
  }
  const requestCloseRef = useRef(requestClose);
  requestCloseRef.current = requestClose;

  // Body scroll lock, initial focus, and focus restore on close.
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      trigger?.focus?.();
    };
  }, []);

  // ESC to close + simple Tab focus trap within the panel.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        requestCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSave() {
    const next: { name?: string; email?: string } = {};
    if (!draft.clientName.trim()) next.name = t.detail.requiredName;
    if (draft.email.trim() && !EMAIL_RE.test(draft.email.trim())) {
      next.email = t.detail.invalidEmail;
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById(next.name ? "f-name" : "f-email")?.focus();
      return;
    }
    onSave(
      { ...draft, clientName: draft.clientName.trim(), email: draft.email.trim() },
      mode === "edit" ? card.id : undefined,
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="card-modal-title"
        className="my-auto w-full max-w-lg rounded-card bg-surface shadow-elevated"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2
            id="card-modal-title"
            className="text-[18px] font-bold text-ink"
          >
            {mode === "new" ? t.detail.newTitle : t.detail.editTitle}
          </h2>
          <button
            type="button"
            onClick={requestClose}
            aria-label={t.actions.close}
            className="rounded-full p-1.5 text-slate transition-colors hover:bg-surface-accent"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="f-name">
                {t.fields.clientName} *
              </label>
              <input
                id="f-name"
                ref={firstFieldRef}
                value={draft.clientName}
                onChange={(e) => set("clientName", e.target.value)}
                className={inputClass}
                aria-invalid={!!errors.name}
                aria-required="true"
                aria-describedby={errors.name ? "f-name-error" : undefined}
              />
              {errors.name && (
                <p id="f-name-error" role="alert" className="mt-1 text-[12px] text-danger">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="f-email">
                {t.fields.email}
              </label>
              <input
                id="f-email"
                type="email"
                value={draft.email}
                onChange={(e) => set("email", e.target.value)}
                className={inputClass}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "f-email-error" : undefined}
              />
              {errors.email && (
                <p id="f-email-error" role="alert" className="mt-1 text-[12px] text-danger">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="f-phone">
                {t.fields.phone}
              </label>
              <input
                id="f-phone"
                type="tel"
                value={draft.phone}
                onChange={(e) => set("phone", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="f-mandate">
                {t.fields.mandateType}
              </label>
              <select
                id="f-mandate"
                value={draft.mandateType}
                onChange={(e) =>
                  set("mandateType", e.target.value as CardDraft["mandateType"])
                }
                className={inputClass}
              >
                {MANDATE_ORDER.map((id) => (
                  <option key={id} value={id}>
                    {t.mandates[id]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="f-assignee">
                {t.fields.assignee}
              </label>
              <select
                id="f-assignee"
                value={draft.assigneeId}
                onChange={(e) => set("assigneeId", e.target.value)}
                className={inputClass}
              >
                <option value="">{t.misc.unassigned}</option>
                {TEAM_MEMBERS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} · {t.roles[m.roleId]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="f-priority">
                {t.fields.priority}
              </label>
              <select
                id="f-priority"
                value={draft.priority}
                onChange={(e) =>
                  set("priority", e.target.value as CardDraft["priority"])
                }
                className={inputClass}
              >
                {PRIORITY_ORDER.map((id) => (
                  <option key={id} value={id}>
                    {t.priorities[id]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="f-phase">
                {t.fields.phase}
              </label>
              <select
                id="f-phase"
                value={draft.phase}
                onChange={(e) =>
                  set("phase", e.target.value as CardDraft["phase"])
                }
                className={inputClass}
              >
                {PHASE_ORDER.map((id) => (
                  <option key={id} value={id}>
                    {t.phases[id]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="f-date">
                {t.fields.dateAdded}
              </label>
              <input
                id="f-date"
                type="date"
                value={draft.dateAdded}
                onChange={(e) => set("dateAdded", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="f-notes">
                {t.fields.notes}
              </label>
              <textarea
                id="f-notes"
                value={draft.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={4}
                placeholder={t.detail.notesPlaceholder}
                className={`${inputClass} resize-y`}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4">
          <div>
            {mode === "edit" && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirmDelete) onDelete(card.id);
                  else setConfirmDelete(true);
                }}
                onBlur={() => setConfirmDelete(false)}
                className={`flex items-center gap-1.5 rounded-pill px-3 py-2 text-[13px] font-bold transition-colors ${
                  confirmDelete
                    ? "bg-danger text-white"
                    : "text-danger hover:bg-danger/10"
                }`}
              >
                <Trash2 size={15} aria-hidden />
                {confirmDelete ? t.detail.deleteConfirm : t.actions.delete}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={requestClose}
              className="rounded-pill border border-line px-4 py-2 text-[13px] font-bold text-slate transition-colors hover:bg-surface-accent"
            >
              {t.actions.cancel}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-pill bg-brand px-5 py-2 text-[13px] font-bold text-ink shadow-card transition-colors hover:bg-brand-dark"
            >
              {t.actions.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
