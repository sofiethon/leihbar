// Gemeinsame Typen des Formulars „Gegenstand anbieten“ (Formular und Server Action).

export type AnbietenFeld = "titel" | "kategorie" | "beschreibung" | "ort" | "preis" | "besitzer";

export type AnbietenZustand = {
  /** Eine Meldung je fehlerhaftem Feld, als ganzer deutscher Satz. */
  fehler: Partial<Record<AnbietenFeld | "allgemein", string>>;
  /** Die eingegebenen Werte, damit das Formular nach einem Fehler nicht leer ist. */
  werte: Record<AnbietenFeld, string>;
};

export const leererZustand: AnbietenZustand = {
  fehler: {},
  werte: { titel: "", kategorie: "", beschreibung: "", ort: "", preis: "", besitzer: "" },
};
