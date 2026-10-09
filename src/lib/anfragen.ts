import type { Gegenstand } from "@/data/gegenstaende";
import { spalten, zuGegenstand, type ItemZeile } from "@/lib/gegenstaende";
import { createClient } from "@/lib/supabase/server";

export type AnfrageStatus = {
  /** Wie viele Personen den Gegenstand angefragt haben. */
  anzahl: number;
  angemeldet: boolean;
  /** Ob die angemeldete Person diesen Gegenstand angefragt hat. */
  angefragt: boolean;
  /** Ob der Gegenstand der angemeldeten Person selbst gehört. */
  eigener: boolean;
};

/** Zähler und Zustand des Buttons für einen Gegenstand. */
export async function ladeAnfrageStatus(itemId: string): Promise<AnfrageStatus> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ count, error }, eigeneAnfrage, gegenstand] = await Promise.all([
    supabase.from("requests").select("id", { count: "exact", head: true }).eq("item_id", itemId),
    user
      ? supabase
          .from("requests")
          .select("id")
          .eq("item_id", itemId)
          .eq("user_id", user.id)
          .maybeSingle()
      : null,
    user ? supabase.from("items").select("owner_id").eq("id", itemId).maybeSingle() : null,
  ]);
  if (error) {
    throw new Error(`Anfragen konnten nicht gezählt werden: ${error.message}`);
  }

  return {
    anzahl: count ?? 0,
    angemeldet: Boolean(user),
    angefragt: Boolean(eigeneAnfrage?.data),
    eigener: Boolean(user && gegenstand?.data?.owner_id === user.id),
  };
}

/** Die Gegenstände, die die angemeldete Person angefragt hat – die neueste Anfrage zuerst. */
export async function ladeMeineAnfragen(): Promise<Gegenstand[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("requests")
    .select(`created_at, items (${spalten})`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .overrideTypes<{ created_at: string; items: ItemZeile | null }[], { merge: false }>();
  if (error) {
    throw new Error(`Anfragen konnten nicht geladen werden: ${error.message}`);
  }

  return data.flatMap((zeile) => (zeile.items ? [zuGegenstand(zeile.items)] : []));
}
