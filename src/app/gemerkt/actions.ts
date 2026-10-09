"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sichereWeiterleitung } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

/** Merkt den Gegenstand – oder nimmt das Herz weg, wenn er schon gemerkt ist. */
export async function merkenUmschalten(itemId: string, zurueck: string) {
  const ziel = sichereWeiterleitung(zurueck);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/anmelden?weiter=${encodeURIComponent(ziel)}`);
  }

  const { data: bestehend } = await supabase
    .from("favorites")
    .select("id")
    .eq("item_id", itemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (bestehend) {
    await supabase.from("favorites").delete().eq("id", bestehend.id);
  } else {
    await supabase.from("favorites").insert({ item_id: itemId, user_id: user.id });
  }

  revalidatePath("/");
  revalidatePath("/gemerkt");
  revalidatePath("/meine-anfragen");
  revalidatePath(`/gegenstaende/${itemId}`);
}
