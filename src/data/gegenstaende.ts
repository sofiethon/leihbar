// Typen und Kategorien für Gegenstände. Die Gegenstände selbst liegen seit Issue 4
// in der Supabase-Tabelle `items` (Bilder der Startdaten in public/gegenstaende/).

export const kategorien = ["Mode", "Wohnen & Deko", "Technik", "Freizeit"] as const;
export type Kategorie = (typeof kategorien)[number];

export type Gegenstand = {
  id: string;
  titel: string;
  kategorie: Kategorie;
  beschreibung: string;
  besitzer: string;
  ort: string;
  preisProTag: number; // Euro pro Tag, 0 = gratis
  verfuegbar: boolean;
  bild: string | null; // Pfad unter public/, z. B. "/gegenstaende/abendkleid.jpg"; null = Platzhalter
};
