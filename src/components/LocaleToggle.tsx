"use client";

import { useT } from "@/components/LocaleProvider";
import type { Locale } from "@/lib/types";

const LOCALES: Locale[] = ["de", "en"];

/** Compact segmented DE | EN language switch. */
export function LocaleToggle() {
  const { locale, setLocale, t } = useT();
  return (
    <div
      className="inline-flex items-center rounded-pill border border-line p-0.5"
      role="group"
      aria-label={t.misc.language}
    >
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`rounded-pill px-2.5 py-1 text-[12px] font-bold uppercase tracking-wide transition-colors ${
            locale === l
              ? "bg-brand text-ink"
              : "text-slate hover:text-ink"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
