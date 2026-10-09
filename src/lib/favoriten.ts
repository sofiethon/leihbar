import type { Gegenstand } from "@/data/gegenstaende";
import { spalten, zuGegenstand, type ItemZeile } from "@/lib/gegenstaende";
import { createClient } from "@/lib/supabase/server";

/** Die IDs aller Gegenstände, die die angemeldete Person gemerkt hat (leer, wenn niemand angemeldet ist). */
export async function ladeGemerkteIds(): Promise<Set<string>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Set();
  }

  const { data, error } = await supabase.from("favorites").select("item_id").eq("user_id", user.id);
  if (error) {
    throw new Error(`Gemerkte Gegenstände konnten nicht geladen werden: ${error.message}`);
  }
  return new Set(data.map((zeile) => zeile.item_id));
}

/** Die gemerkten Gegenstände der angemeldeten Person – das zuletzt gemerkte zuerst. */
export async function ladeGemerkteGegenstaende(): Promise<Gegenstand[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("favorites")
    .select(`created_at, items (${spalten})`)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .overrideTypes<{ created_at: string; items: ItemZeile | null }[], { merge: false }>();
  if (error) {
    throw new Error(`Gemerkte Gegenstände konnten nicht geladen werden: ${error.message}`);
  }

  return data.flatMap((zeile) => (zeile.items ? [zuGegenstand(zeile.items)] : []));
}
