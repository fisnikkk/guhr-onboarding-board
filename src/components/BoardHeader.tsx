"use client";

import { Plus, RotateCcw, Search, X } from "lucide-react";
import { MANDATE_ORDER, TEAM_MEMBERS } from "@/lib/constants";
import { hasActiveFilters } from "@/lib/board";
import { useT } from "@/components/LocaleProvider";
import { Logo } from "@/components/ui/Logo";
import { LocaleToggle } from "@/components/LocaleToggle";
import type { BoardFilters } from "@/lib/types";

const controlClass =
  "rounded-pill border border-line bg-surface px-3 py-2 text-[13px] text-ink outline-none transition-colors focus:border-brand focus-visible:ring-2 focus-visible:ring-slate";

/**
 * Top app bar (brand lockup + language/reset) and the toolbar beneath it
 * (search, mandate/assignee filters, client count, "new client").
 */
export function BoardHeader({
  filters,
  onFiltersChange,
  totalCount,
  visibleCount,
  onNewClient,
  onReset,
}: {
  filters: BoardFilters;
  onFiltersChange: (patch: Partial<BoardFilters>) => void;
  totalCount: number;
  visibleCount: number;
  onNewClient: () => void;
  onReset: () => void;
}) {
  const { t } = useT();
  const filtersActive = hasActiveFilters(filters);

  return (
    <header className="shrink-0 border-b border-line bg-surface">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden h-8 w-px bg-line sm:block" />
          <span className="hidden text-[13px] font-bold uppercase tracking-wider text-slate sm:block">
            {t.appTagline}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="hidden items-center gap-1.5 rounded-pill border border-line px-3 py-2 text-[12px] font-bold text-slate transition-colors hover:bg-surface-accent sm:flex"
            title={t.actions.resetDemo}
          >
            <RotateCcw size={14} aria-hidden />
            {t.actions.resetDemo}
          </button>
          <LocaleToggle />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 px-4 pb-3 sm:px-6">
        {/* Search */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            placeholder={t.header.searchPlaceholder}
            aria-label={t.header.searchPlaceholder}
            className={`${controlClass} w-full pl-9`}
          />
        </div>

        {/* Mandate filter */}
        <select
          value={filters.mandateType}
          onChange={(e) =>
            onFiltersChange({
              mandateType: e.target.value as BoardFilters["mandateType"],
            })
          }
          aria-label={t.header.filterMandate}
          className={controlClass}
        >
          <option value="all">{t.header.allMandates}</option>
          {MANDATE_ORDER.map((id) => (
            <option key={id} value={id}>
              {t.mandates[id]}
            </option>
          ))}
        </select>

        {/* Assignee filter */}
        <select
          value={filters.assigneeId}
          onChange={(e) => onFiltersChange({ assigneeId: e.target.value })}
          aria-label={t.header.filterAssignee}
          className={controlClass}
        >
          <option value="all">{t.header.allAssignees}</option>
          {TEAM_MEMBERS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
          <option value="">{t.header.unassigned}</option>
        </select>

        {filtersActive && (
          <button
            type="button"
            onClick={() =>
              onFiltersChange({ search: "", mandateType: "all", assigneeId: "all" })
            }
            className="flex items-center gap-1 rounded-pill px-2.5 py-2 text-[12px] font-bold text-slate transition-colors hover:bg-surface-accent"
          >
            <X size={14} aria-hidden />
            {t.header.clearFilters}
          </button>
        )}

        <div className="ml-auto flex items-center gap-3">
          <span className="text-[12px] text-muted">
            {filtersActive
              ? `${visibleCount} / ${totalCount}`
              : t.board.totalClients(totalCount)}
          </span>
          <button
            type="button"
            onClick={onNewClient}
            className="flex items-center gap-1.5 rounded-pill bg-brand px-4 py-2 text-[13px] font-bold text-ink shadow-card transition-colors hover:bg-brand-dark"
          >
            <Plus size={16} aria-hidden />
            {t.actions.newClient}
          </button>
        </div>
      </div>
    </header>
  );
}
