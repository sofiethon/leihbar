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

  const [{ data: zaehler, error }, eigeneAnfrage, gegenstand] = await Promise.all([
    supabase.from("request_counts").select("anzahl").eq("item_id", itemId).maybeSingle(),
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
    anzahl: zaehler?.anzahl ?? 0,
    angemeldet: Boolean(user),
    angefragt: Boolean(eigeneAnfrage?.data),
    eigener: Boolean(user && gegenstand?.data?.owner_id === user.id),
  };
}

export type Status = "offen" | "angenommen" | "abgelehnt";

export type MeineAnfrage = { gegenstand: Gegenstand; status: Status };

export type AnfrageAnMich = { id: string; email: string; status: Status };

/** Die Anfragen auf einen Gegenstand – nur für die Besitzer*in lesbar, sonst leer. */
export async function ladeAnfragenAnMich(itemId: string): Promise<AnfrageAnMich[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .select("id, user_email, status")
    .eq("item_id", itemId)
    .order("created_at", { ascending: true })
    .overrideTypes<{ id: string; user_email: string | null; status: Status }[], { merge: false }>();
  if (error) {
    throw new Error(`Anfragen konnten nicht geladen werden: ${error.message}`);
  }
  return data.map((z) => ({ id: z.id, email: z.user_email ?? "unbekannt", status: z.status }));
}

/** Die Gegenstände, die die angemeldete Person angefragt hat – die neueste Anfrage zuerst. */
export async function ladeMeineAnfragen(): Promise<MeineAnfrage[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("requests")
    .select(`created_at, status, items (${spalten})`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .overrideTypes<{ created_at: string; status: Status; items: ItemZeile | null }[], { merge: false }>();
  if (error) {
    throw new Error(`Anfragen konnten nicht geladen werden: ${error.message}`);
  }

  return data.flatMap((zeile) =>
    zeile.items ? [{ gegenstand: zuGegenstand(zeile.items), status: zeile.status }] : [],
  );
}
