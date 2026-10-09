// Gemeinsame Typen und Hilfen für Registrieren und Anmelden.

export type AnmeldenZustand = {
  /** Meldung als ganzer deutscher Satz; leer, wenn alles gut ist. */
  fehler: string;
  email: string;
};

export const leererAnmeldeZustand: AnmeldenZustand = { fehler: "", email: "" };

/** Erlaubt nur Ziele innerhalb der App (verhindert Weiterleitungen auf fremde Seiten). */
export function sichereWeiterleitung(ziel: unknown): string {
  if (typeof ziel === "string" && ziel.startsWith("/") && !ziel.startsWith("//")) {
    return ziel;
  }
  return "/";
}
