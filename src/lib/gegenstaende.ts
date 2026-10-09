import type { Gegenstand, Kategorie } from "@/data/gegenstaende";
import { createClient } from "@/lib/supabase/server";

// So sieht eine Zeile der Tabelle `items` aus.
export type ItemZeile = {
  id: string;
  titel: string;
  kategorie: Kategorie;
  beschreibung: string;
  ort: string;
  preis_pro_tag: number;
  besitzer_name: string;
  verfuegbar: boolean;
  bild_url: string | null;
};

export const spalten =
  "id, titel, kategorie, beschreibung, ort, preis_pro_tag, besitzer_name, verfuegbar, bild_url";

export function zuGegenstand(zeile: ItemZeile): Gegenstand {
  return {
    id: zeile.id,
    titel: zeile.titel,
    kategorie: zeile.kategorie,
    beschreibung: zeile.beschreibung,
    besitzer: zeile.besitzer_name,
    ort: zeile.ort,
    preisProTag: Number(zeile.preis_pro_tag),
    verfuegbar: zeile.verfuegbar,
    bild: zeile.bild_url,
  };
}

/** Alle gerade ausleihbaren Gegenstände, neueste zuerst. Mit `kategorie` nur diese Kategorie. */
export async function ladeVerfuegbareGegenstaende(kategorie?: Kategorie) {
  const supabase = await createClient();
  let abfrage = supabase
    .from("items")
    .select(spalten)
    .eq("verfuegbar", true)
    .order("created_at", { ascending: false });
  if (kategorie) {
    abfrage = abfrage.eq("kategorie", kategorie);
  }

  const { data, error } = await abfrage.overrideTypes<ItemZeile[], { merge: false }>();
  if (error) {
    throw new Error(`Gegenstände konnten nicht geladen werden: ${error.message}`);
  }
  return data.map(zuGegenstand);
}

/** Ein Gegenstand anhand seiner ID; `null`, wenn es ihn nicht gibt (oder die ID ungültig ist). */
export async function ladeGegenstand(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select(spalten)
    .eq("id", id)
    .maybeSingle<ItemZeile>();
  // Eine Adresse, die keine gültige ID ist, liefert einen Fehler – für uns heißt das „nicht gefunden“.
  if (error || !data) {
    return null;
  }
  return zuGegenstand(data);
}
