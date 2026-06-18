/**
 * Bilingual (DE/EN) dictionary. Both locales implement the same `Dictionary`
 * interface, so TypeScript guarantees every key exists in both languages.
 * German is the default; English is available via the header toggle.
 */

import type {
  Locale,
  MandateTypeId,
  PhaseId,
  PriorityId,
  RoleId,
} from "./types";

export interface Dictionary {
  appName: string;
  appTagline: string;
  phases: Record<PhaseId, string>;
  phaseHints: Record<PhaseId, string>;
  mandates: Record<MandateTypeId, string>;
  priorities: Record<PriorityId, string>;
  roles: Record<RoleId, string>;
  fields: {
    clientName: string;
    email: string;
    phone: string;
    mandateType: string;
    assignee: string;
    dateAdded: string;
    priority: string;
    phase: string;
    notes: string;
  };
  actions: {
    addCard: string;
    newClient: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    close: string;
    resetDemo: string;
  };
  header: {
    searchPlaceholder: string;
    filterMandate: string;
    filterAssignee: string;
    allMandates: string;
    allAssignees: string;
    unassigned: string;
    clearFilters: string;
    resetConfirm: string;
  };
  detail: {
    newTitle: string;
    editTitle: string;
    notesPlaceholder: string;
    deleteConfirm: string;
    requiredName: string;
    invalidEmail: string;
    unsaved: string;
  };
  board: {
    emptyColumn: string;
    addFirstCard: string;
    totalClients: (n: number) => string;
    filteredOut: string;
    noResults: string;
  };
  misc: {
    unassigned: string;
    addedOn: string;
    nextSteps: string;
    language: string;
    optional: string;
    quickAddPlaceholder: string;
    dragHint: string;
  };
}

const de: Dictionary = {
  appName: "Onboarding-Board",
  appTagline: "Mandanten-Onboarding",
  phases: {
    new_inquiry: "Neue Anfrage",
    consultation_scheduled: "Erstgespräch geplant",
    documents_requested: "Unterlagen angefordert",
    documents_received: "Unterlagen erhalten",
    engagement_letter_sent: "Mandatsvertrag versendet",
    signed_active: "Aktiv & Mandatiert",
    on_hold: "Pausiert",
  },
  phaseHints: {
    new_inquiry: "Erstkontakt erhalten, noch nicht qualifiziert",
    consultation_scheduled: "Termin gebucht, Erstgespräch ausstehend",
    documents_requested: "Warten auf die Unterlagen des Mandanten",
    documents_received: "Alle Unterlagen da, interne Prüfung läuft",
    engagement_letter_sent: "Mandatsvertrag versendet",
    signed_active: "Vollständig onboarded, an das Team übergeben",
    on_hold: "Onboarding aus einem beliebigen Grund pausiert",
  },
  mandates: {
    einkommensteuer: "Einkommensteuer",
    gmbh: "GmbH",
    freelancer: "Freiberufler",
    gewerbe: "Gewerbe",
    umsatzsteuer: "Umsatzsteuer",
    lohnbuchhaltung: "Lohnbuchhaltung",
    verein: "Verein",
    sonstiges: "Sonstiges",
  },
  priorities: {
    normal: "Normal",
    high: "Wichtig",
    urgent: "Dringend",
  },
  roles: {
    partner: "Partnerin / Steuerberaterin",
    tax_advisor: "Steuerberater",
    tax_specialist: "Steuerfachwirtin",
    tax_clerk: "Steuerfachangestellter",
    accountant: "Buchhalter",
    office: "Sekretariat",
  },
  fields: {
    clientName: "Mandantenname",
    email: "E-Mail",
    phone: "Telefon",
    mandateType: "Mandatsart",
    assignee: "Zuständig",
    dateAdded: "Hinzugefügt am",
    priority: "Priorität",
    phase: "Phase",
    notes: "Notizen / Nächste Schritte",
  },
  actions: {
    addCard: "Karte hinzufügen",
    newClient: "Neuer Mandant",
    save: "Speichern",
    cancel: "Abbrechen",
    delete: "Löschen",
    edit: "Bearbeiten",
    close: "Schließen",
    resetDemo: "Demodaten zurücksetzen",
  },
  header: {
    searchPlaceholder: "Mandanten suchen …",
    filterMandate: "Mandatsart",
    filterAssignee: "Zuständig",
    allMandates: "Alle Mandatsarten",
    allAssignees: "Alle Mitarbeiter",
    unassigned: "Nicht zugewiesen",
    clearFilters: "Filter zurücksetzen",
    resetConfirm:
      "Alle Änderungen verwerfen und die Demodaten wiederherstellen?",
  },
  detail: {
    newTitle: "Neuen Mandanten anlegen",
    editTitle: "Mandant bearbeiten",
    notesPlaceholder: "Nächste Schritte, offene Punkte, Gesprächsnotizen …",
    deleteConfirm: "Diese Karte wirklich löschen?",
    requiredName: "Bitte einen Mandantennamen angeben.",
    invalidEmail: "Bitte eine gültige E-Mail-Adresse angeben.",
    unsaved: "Es gibt ungespeicherte Änderungen. Trotzdem schließen?",
  },
  board: {
    emptyColumn: "Keine Mandanten in dieser Phase",
    addFirstCard: "Erste Karte hinzufügen",
    totalClients: (n) => (n === 1 ? "1 Mandant" : `${n} Mandanten`),
    filteredOut: "durch Filter ausgeblendet",
    noResults: "Keine Mandanten entsprechen den Filtern.",
  },
  misc: {
    unassigned: "Nicht zugewiesen",
    addedOn: "Hinzugefügt",
    nextSteps: "Nächste Schritte",
    language: "Sprache",
    optional: "optional",
    quickAddPlaceholder: "Mandantenname …",
    dragHint: "Zum Verschieben ziehen",
  },
};

const en: Dictionary = {
  appName: "Onboarding Board",
  appTagline: "Client Onboarding",
  phases: {
    new_inquiry: "New Inquiry",
    consultation_scheduled: "Initial Consultation Scheduled",
    documents_requested: "Documents Requested",
    documents_received: "Documents Received",
    engagement_letter_sent: "Engagement Letter Sent",
    signed_active: "Signed & Active",
    on_hold: "On Hold",
  },
  phaseHints: {
    new_inquiry: "First contact received, not yet qualified",
    consultation_scheduled: "Meeting booked, awaiting first call",
    documents_requested: "Waiting for the client to submit documents",
    documents_received: "All docs in, internal review in progress",
    engagement_letter_sent: "Contract / Mandatsvertrag sent out",
    signed_active: "Fully onboarded, handed over to the team",
    on_hold: "Onboarding stalled for any reason",
  },
  mandates: {
    einkommensteuer: "Income Tax",
    gmbh: "GmbH (Corp.)",
    freelancer: "Freelancer",
    gewerbe: "Trade Business",
    umsatzsteuer: "VAT",
    lohnbuchhaltung: "Payroll",
    verein: "Association",
    sonstiges: "Other",
  },
  priorities: {
    normal: "Normal",
    high: "High",
    urgent: "Urgent",
  },
  roles: {
    partner: "Partner / Tax Advisor",
    tax_advisor: "Tax Advisor",
    tax_specialist: "Tax Specialist",
    tax_clerk: "Tax Clerk",
    accountant: "Accountant",
    office: "Office",
  },
  fields: {
    clientName: "Client name",
    email: "Email",
    phone: "Phone",
    mandateType: "Type of mandate",
    assignee: "Assigned to",
    dateAdded: "Date added",
    priority: "Priority",
    phase: "Phase",
    notes: "Notes / next steps",
  },
  actions: {
    addCard: "Add card",
    newClient: "New client",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    resetDemo: "Reset demo data",
  },
  header: {
    searchPlaceholder: "Search clients …",
    filterMandate: "Mandate type",
    filterAssignee: "Assigned to",
    allMandates: "All mandate types",
    allAssignees: "All team members",
    unassigned: "Unassigned",
    clearFilters: "Clear filters",
    resetConfirm: "Discard all changes and restore the demo data?",
  },
  detail: {
    newTitle: "Add new client",
    editTitle: "Edit client",
    notesPlaceholder: "Next steps, open items, call notes …",
    deleteConfirm: "Really delete this card?",
    requiredName: "Please enter a client name.",
    invalidEmail: "Please enter a valid email address.",
    unsaved: "You have unsaved changes. Close anyway?",
  },
  board: {
    emptyColumn: "No clients in this phase",
    addFirstCard: "Add the first card",
    totalClients: (n) => (n === 1 ? "1 client" : `${n} clients`),
    filteredOut: "hidden by filters",
    noResults: "No clients match the current filters.",
  },
  misc: {
    unassigned: "Unassigned",
    addedOn: "Added",
    nextSteps: "Next steps",
    language: "Language",
    optional: "optional",
    quickAddPlaceholder: "Client name …",
    dragHint: "Drag to move",
  },
};

export const DICTIONARIES: Record<Locale, Dictionary> = { de, en };

export const DEFAULT_LOCALE: Locale = "de";

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}
