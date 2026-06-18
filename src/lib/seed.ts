/**
 * Seeded demo board — 17 realistic German tax-advisory clients spread across all
 * seven phases and all eight mandate types. Makes the board demo as a living tool
 * rather than an empty shell. Notes are in German (real staff content); only the
 * UI chrome is bilingual.
 */

import { SCHEMA_VERSION } from "./constants";
import type { BoardState, Card } from "./types";

const cards: Card[] = [
  // ── New Inquiry ─────────────────────────────────────────────
  {
    id: "seed-hofmann",
    clientName: "Bäckerei Hofmann GmbH",
    email: "kontakt@baeckerei-hofmann.de",
    phone: "+49 30 9087654",
    mandateType: "gmbh",
    assigneeId: "tm-lena",
    dateAdded: "2026-06-16",
    phase: "new_inquiry",
    priority: "high",
    notes:
      "Anfrage über das Website-Formular. Sucht neuen Steuerberater zum Jahreswechsel. Rückruf vereinbaren.",
    order: 0,
  },
  {
    id: "seed-lemke",
    clientName: "Dr. Katharina Lemke",
    email: "k.lemke@gmx.de",
    phone: "+49 89 4451200",
    mandateType: "einkommensteuer",
    assigneeId: "tm-lena",
    dateAdded: "2026-06-15",
    phase: "new_inquiry",
    priority: "normal",
    notes: "Empfehlung von Bestandsmandant Sauer. Einkommensteuererklärung 2025.",
    order: 1,
  },
  {
    id: "seed-demir",
    clientName: "Yusuf Demir",
    email: "yusuf.demir.design@gmail.com",
    phone: "+49 176 30112244",
    mandateType: "freelancer",
    assigneeId: "tm-lena",
    dateAdded: "2026-06-12",
    phase: "new_inquiry",
    priority: "normal",
    notes:
      "Freiberuflicher UX-Designer, erste Steuererklärung als Selbstständiger. Braucht Beratung zur Kleinunternehmerregelung.",
    order: 2,
  },
  {
    id: "seed-stiftung",
    clientName: "Stiftung Lichtblick",
    email: "info@stiftung-lichtblick.de",
    phone: "+49 30 2003040",
    mandateType: "sonstiges",
    assigneeId: "tm-lena",
    dateAdded: "2026-06-14",
    phase: "new_inquiry",
    priority: "normal",
    notes: "Gemeinnützige Stiftung mit komplexer Struktur. Erstberatung gewünscht.",
    order: 3,
  },

  // ── Initial Consultation Scheduled ──────────────────────────
  {
    id: "seed-lindner",
    clientName: "Lindner & Partner Architekten",
    email: "info@lindner-architekten.de",
    phone: "+49 711 2204455",
    mandateType: "freelancer",
    assigneeId: "tm-michael",
    dateAdded: "2026-06-08",
    phase: "consultation_scheduled",
    priority: "high",
    notes:
      "Erstgespräch am 22.06. um 10:00 Uhr. Wechsel vom bisherigen Berater wegen Kapazitätsengpässen.",
    order: 0,
  },
  {
    id: "seed-wagner",
    clientName: "Sophie Wagner",
    email: "sophie.wagner@web.de",
    phone: "+49 30 5567891",
    mandateType: "einkommensteuer",
    assigneeId: "tm-julia",
    dateAdded: "2026-06-05",
    phase: "consultation_scheduled",
    priority: "normal",
    notes: "Videocall am 20.06. Vermietung Eigentumswohnung, Anlage V relevant.",
    order: 1,
  },

  // ── Documents Requested ─────────────────────────────────────
  {
    id: "seed-technord",
    clientName: "TechNord Solutions GmbH",
    email: "buchhaltung@technord.io",
    phone: "+49 40 7789010",
    mandateType: "gmbh",
    assigneeId: "tm-michael",
    dateAdded: "2026-05-28",
    phase: "documents_requested",
    priority: "high",
    notes:
      "Checkliste versendet: Eröffnungsbilanz, Gesellschaftsvertrag, Bankvollmacht. 1. Erinnerung am 15.06.",
    order: 0,
  },
  {
    id: "seed-brenner",
    clientName: "Markus Brenner Elektrotechnik",
    email: "m.brenner@brenner-elektro.de",
    phone: "+49 911 334422",
    mandateType: "gewerbe",
    assigneeId: "tm-thomas",
    dateAdded: "2026-05-30",
    phase: "documents_requested",
    priority: "normal",
    notes: "Elektrohandwerk. Fehlen noch: EÜR-Vorjahr und Kassenbuch.",
    order: 1,
  },
  {
    id: "seed-solera",
    clientName: "Café Solera",
    email: "hallo@cafe-solera.de",
    phone: "+49 221 998877",
    mandateType: "umsatzsteuer",
    assigneeId: "tm-thomas",
    dateAdded: "2026-06-02",
    phase: "documents_requested",
    priority: "urgent",
    notes:
      "Gastronomie. Dringend wegen anstehender USt-Voranmeldung. Belege bisher nur teilweise eingereicht.",
    order: 2,
  },

  // ── Documents Received ──────────────────────────────────────
  {
    id: "seed-hartmann",
    clientName: "Hartmann Immobilien GmbH",
    email: "verwaltung@hartmann-immo.de",
    phone: "+49 69 2211009",
    mandateType: "gmbh",
    assigneeId: "tm-michael",
    dateAdded: "2026-05-20",
    phase: "documents_received",
    priority: "normal",
    notes: "Unterlagen vollständig. Interne Prüfung der Eröffnungsbilanz läuft.",
    order: 0,
  },
  {
    id: "seed-petrova",
    clientName: "Elena Petrova",
    email: "elena.petrova@protonmail.com",
    phone: "+49 151 22003344",
    mandateType: "freelancer",
    assigneeId: "tm-julia",
    dateAdded: "2026-05-22",
    phase: "documents_received",
    priority: "normal",
    notes: "Fotografin. Unterlagen geprüft, Mandatsvertrag wird vorbereitet.",
    order: 1,
  },

  // ── Engagement Letter Sent ──────────────────────────────────
  {
    id: "seed-greenfleet",
    clientName: "GreenFleet Mobility UG",
    email: "finance@greenfleet.de",
    phone: "+49 30 4456677",
    mandateType: "gmbh",
    assigneeId: "tm-michael",
    dateAdded: "2026-05-12",
    phase: "engagement_letter_sent",
    priority: "high",
    notes: "Mandatsvertrag am 10.06. per DocuSign versendet. Warten auf Unterschrift.",
    order: 0,
  },
  {
    id: "seed-krueger",
    clientName: "Familie Krüger",
    email: "kruegerfamilie@t-online.de",
    phone: "+49 4101 556677",
    mandateType: "einkommensteuer",
    assigneeId: "tm-julia",
    dateAdded: "2026-05-15",
    phase: "engagement_letter_sent",
    priority: "normal",
    notes:
      "Mandatsvertrag postalisch versendet. Gemeinsame Veranlagung, Kinderbetreuungskosten beachten.",
    order: 1,
  },

  // ── Signed & Active ─────────────────────────────────────────
  {
    id: "seed-bauer",
    clientName: "Bauer Logistik GmbH",
    email: "info@bauer-logistik.de",
    phone: "+49 89 778811",
    mandateType: "lohnbuchhaltung",
    assigneeId: "tm-michael",
    dateAdded: "2026-04-02",
    phase: "signed_active",
    priority: "normal",
    notes: "Unterschrieben, an das Team übergeben. Laufende Finanzbuchhaltung + Lohnabrechnung (14 Mitarbeiter).",
    order: 0,
  },
  {
    id: "seed-voss",
    clientName: "Annika Voss",
    email: "annika@voss-texte.de",
    phone: "+49 30 6677889",
    mandateType: "freelancer",
    assigneeId: "tm-julia",
    dateAdded: "2026-03-18",
    phase: "signed_active",
    priority: "normal",
    notes: "Aktiv. Quartalsweise EÜR. Sehr gut organisiert, alle Belege digital.",
    order: 1,
  },
  {
    id: "seed-tus",
    clientName: "TuS Eichwalde e.V.",
    email: "vorstand@tus-eichwalde.de",
    phone: "+49 33762 44556",
    mandateType: "verein",
    assigneeId: "tm-thomas",
    dateAdded: "2026-02-10",
    phase: "signed_active",
    priority: "normal",
    notes: "Gemeinnütziger Sportverein, aktiv. Jahresabschluss + Spendenbescheinigungen.",
    order: 2,
  },

  // ── On Hold / Paused ────────────────────────────────────────
  {
    id: "seed-bellavista",
    clientName: "Restaurant Bella Vista",
    email: "bellavista.gl@gmail.com",
    phone: "+49 2202 113344",
    mandateType: "gewerbe",
    assigneeId: "tm-thomas",
    dateAdded: "2026-05-01",
    phase: "on_hold",
    priority: "normal",
    notes: "Pausiert: Inhaber überlegt Geschäftsaufgabe. Wiedervorlage in 4 Wochen.",
    order: 0,
  },
];

/** A fresh copy of the seed board (deep-cloned so callers can mutate safely). */
export function createSeedBoard(): BoardState {
  return {
    version: SCHEMA_VERSION,
    cards: cards.map((c) => ({ ...c })),
  };
}
