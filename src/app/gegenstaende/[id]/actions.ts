"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Ergebnis von `anfrageUmschalten`: bei einem Fehler steht hier ein ganzer deutscher Satz. */
export type AnfrageErgebnis = { fehler?: string };

/** Fragt den Gegenstand an – oder zieht die Anfrage zurück, wenn sie schon besteht. */
export async function anfrageUmschalten(itemId: string): Promise<AnfrageErgebnis> {
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
    const { error } = await supabase.from("requests").delete().eq("id", bestehend.id);
    if (error) {
      return { fehler: "Das Zurückziehen hat nicht geklappt. Versuch es bitte gleich noch einmal." };
    }
  } else {
    // Verleihbar ist nur, was nicht der eigenen Person gehört und gerade verfügbar ist.
    const { data: gegenstand } = await supabase
      .from("items")
      .select("owner_id, verfuegbar")
      .eq("id", itemId)
      .maybeSingle();
    if (!gegenstand || gegenstand.owner_id === user.id || !gegenstand.verfuegbar) {
      return { fehler: "Diesen Gegenstand kannst du gerade nicht anfragen." };
    }
    const { error } = await supabase.from("requests").insert({ item_id: itemId, user_id: user.id });
    if (error) {
      return { fehler: "Die Anfrage konnte nicht gespeichert werden. Versuch es bitte gleich noch einmal." };
    }
  }

  revalidatePath(pfad);
  revalidatePath("/meine-anfragen");
  return {};
}

/** Besitzer*in nimmt eine Anfrage an oder lehnt sie ab (die Datenbank erlaubt das nur ihr). */
export async function anfrageBeantworten(
  itemId: string,
  anfrageId: string,
  status: "angenommen" | "abgelehnt",
) {
  const supabase = await createClient();
  await supabase.from("requests").update({ status }).eq("id", anfrageId).eq("item_id", itemId);
  revalidatePath(`/gegenstaende/${itemId}`);
  revalidatePath("/meine-anfragen");
}
