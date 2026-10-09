"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Fragt den Gegenstand an – oder zieht die Anfrage zurück, wenn sie schon besteht. */
export async function anfrageUmschalten(itemId: string) {
  const pfad = `/gegenstaende/${itemId}`;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/anmelden?weiter=${encodeURIComponent(pfad)}`);
  }

  const { data: bestehend } = await supabase
    .from("requests")
    .select("id")
    .eq("item_id", itemId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (bestehend) {
    await supabase.from("requests").delete().eq("id", bestehend.id);
  } else {
    // Verleihbar ist nur, was nicht der eigenen Person gehört und gerade verfügbar ist.
    const { data: gegenstand } = await supabase
      .from("items")
      .select("owner_id, verfuegbar")
      .eq("id", itemId)
      .maybeSingle();
    if (gegenstand && gegenstand.owner_id !== user.id && gegenstand.verfuegbar) {
      await supabase.from("requests").insert({ item_id: itemId, user_id: user.id });
    }
  }

  revalidatePath(pfad);
  revalidatePath("/meine-anfragen");
}
