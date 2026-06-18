# Guhr Onboarding-Board — Design Spec

**Date:** 2026-06-18
**Author:** Trial task — AI Automation Engineer @ Guhr Steuerberatungsgesellschaft mbH
**Status:** Approved, in implementation

## 1. Goal

A Kanban-style CRM board, purpose-built for the **client onboarding process of a German
tax-advisory firm** (Guhr Steuerberatung). Not a generic Trello clone — the columns, card
fields, terminology, demo data, and visual identity are all specific to a Steuerberatung.

## 2. Decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript | Industry standard, 1-click Vercel deploy, strong typing. (Scaffold pulled Next 16 — built against its bundled docs, not stale training data.) |
| Styling | Tailwind CSS v4 (`@theme` tokens) | Brand tokens encoded once, used everywhere. No JS config. |
| Drag & drop | `@dnd-kit` (core + sortable) | Accessible (keyboard + pointer), smooth, no page reload, actively maintained, React 19 compatible. |
| Icons | `lucide-react` | Thin line icons matching the site's Font Awesome line style. |
| Persistence | `localStorage`, behind a `BoardRepository` interface | Zero-setup "runnable locally", survives reload, swappable to a real DB later by implementing one interface. |
| Language | Bilingual DE (default) ⇄ EN, dictionary-based i18n | German firm + non-technical German staff → authentic; EN toggle for reviewers. |
| Tests | Vitest on the pure board reducer | The state logic (move/add/edit/delete/reorder) is the riskiest part — unit-tested in isolation. |

## 3. Brand identity (verified from live guhr-steuerberatung.de CSS)

Single accent **gold `#d0b578`** on white; **Lato** everywhere (Google Fonts; note Lato has no
600 weight → brand "600 buttons" mapped to 700); headings pure black `#000`, body soft gray
`#797979`; cards `10px` radius with `0 4px 20px rgba(0,0,0,.1)` shadow; pill (`25px`) gold
buttons. Flat color, no gradients. Verified success green `#15be7d` reused for the "Active"
phase; peach `#ffbc7d` used sparingly. See `/lib/brand.ts` tokens + `globals.css` `@theme`.

## 4. Domain model

- **7 phases** (ordered): `new_inquiry`, `consultation_scheduled`, `documents_requested`,
  `documents_received`, `engagement_letter_sent`, `signed_active`, `on_hold`.
- **Card**: `id, clientName, email, phone, mandateType, assigneeId, dateAdded (ISO), phase,
  priority, notes, order`.
- **MandateType** (8): Einkommensteuer, GmbH, Freiberufler, Gewerbe, Umsatzsteuer,
  Lohnbuchhaltung, Verein, Sonstiges.
- **Priority** (status indicator): `normal | high | urgent` → color dot. Each phase also has
  its own accent → satisfies "status tag or color indicator" twice over.
- **TeamMember**: seeded roster of 6 with initials avatars + roles.

## 5. Architecture

```
src/
  app/            layout (Lato + LocaleProvider + metadata), page (renders <Board/>), globals.css
  lib/
    types.ts      domain types
    brand.ts      verified brand color tokens (JS, for data-driven inline styles)
    constants.ts  PHASES, MANDATE_TYPES, PRIORITIES, TEAM, storage keys
    colors.ts     getContrastText() + alpha helpers
    i18n.ts       DE/EN dictionaries (typed, same shape) + label maps
    board.ts      PURE reducer: addCard/updateCard/deleteCard/moveCard/reorder (unit-tested)
    storage.ts    BoardRepository interface + localStorage impl + versioned load/save
    seed.ts       ~16 realistic demo clients across phases
    format.ts     locale-aware date, id generation
    board.test.ts vitest
  components/
    LocaleProvider.tsx   ('use client') locale context + persistence + useT()
    Board.tsx            ('use client') DnD context, state, persistence, filter, modal — the spine
    BoardHeader.tsx      logo, search, filters, locale toggle, reset, stats
    Column.tsx           droppable column + header + AddCardForm + empty state
    ClientCard.tsx       draggable compact card
    CardDetailModal.tsx  accessible dialog, full edit/delete
    AddCardForm.tsx      inline add within a column
    LocaleToggle.tsx
    ui/  Logo, Avatar, Badge (mandate), PriorityDot, IconText
```

**Data flow:** `Board` loads state via `BoardRepository` on mount → holds `BoardState` →
all mutations go through pure `board.ts` functions → debounced-persisted. dnd-kit reports
drag end → `moveCard`. Filters are derived (search + mandate + assignee), never mutate state.

## 6. Requirements traceability

Every PDF requirement → where it's met:
- 7 phases → `constants.PHASES` + `Column`. Card fields (name/email/phone/mandate/assignee/
  date/status/notes) → `ClientCard` + `CardDetailModal`. Drag&drop no-reload → dnd-kit in
  `Board`. Card detail view → `CardDetailModal`. Add card in any column → `AddCardForm`.
  Clean layout → restrained brand UI. Branding → verified tokens. Runnable locally →
  `npm run dev`. Repo + README write-up → deliverables.

## 7. Out of scope (YAGNI)

Auth, multi-user/real backend, file uploads, email integration, audit log, due-date
reminders. Architected so persistence is swappable, but not built — a few-hours scope.
