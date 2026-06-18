"use client";

/**
 * Locale context: holds the active language, persists the choice to localStorage,
 * keeps <html lang> in sync, and exposes the matching dictionary via `useT()`.
 * German is the default; the header toggle switches to English.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LOCALE_STORAGE_KEY } from "@/lib/constants";
import { DEFAULT_LOCALE, getDictionary, type Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

interface LocaleContextValue {
  locale: Locale;
  /** Dictionary for the active locale. */
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Start from the default for a stable server/client first paint, then hydrate
  // the saved preference in an effect (avoids hydration mismatch).
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (saved === "de" || saved === "en") setLocaleState(saved);
    } catch {
      /* localStorage unavailable — keep default */
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLocale = useCallback(
    () => setLocale(locale === "de" ? "en" : "de"),
    [locale, setLocale],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, t: getDictionary(locale), setLocale, toggleLocale }),
    [locale, setLocale, toggleLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useT(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useT must be used within a LocaleProvider");
  return ctx;
}
