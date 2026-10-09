"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sichereWeiterleitung, type AnmeldenZustand } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

function lesen(formData: FormData) {
  const email = formData.get("email");
  const passwort = formData.get("passwort");
  return {
    email: typeof email === "string" ? email.trim() : "",
    passwort: typeof passwort === "string" ? passwort : "",
    weiter: sichereWeiterleitung(formData.get("weiter")),
  };
}

function pruefen(email: string, passwort: string) {
  if (!email || !email.includes("@")) return "Bitte gib eine gültige E-Mail-Adresse ein.";
  if (!passwort) return "Bitte gib ein Passwort ein.";
  return "";
}

export async function anmelden(_vorher: AnmeldenZustand, formData: FormData): Promise<AnmeldenZustand> {
  const { email, passwort, weiter } = lesen(formData);
  const fehler = pruefen(email, passwort);
  if (fehler) return { fehler, email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: passwort });
  if (error) {
    return { fehler: "E-Mail oder Passwort stimmt nicht. Bitte versuch es noch einmal.", email };
  }

  revalidatePath("/", "layout");
  redirect(weiter);
}

export async function registrieren(_vorher: AnmeldenZustand, formData: FormData): Promise<AnmeldenZustand> {
  const { email, passwort, weiter } = lesen(formData);
  const fehler = pruefen(email, passwort);
  if (fehler) return { fehler, email };
  if (passwort.length < 6) {
    return { fehler: "Das Passwort muss mindestens 6 Zeichen lang sein.", email };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password: passwort });

  if (error) {
    const meldung = /already|registered/i.test(error.message)
      ? "Mit dieser E-Mail gibt es schon ein Konto. Melde dich stattdessen an."
      : "Das Registrieren hat leider nicht geklappt. Prüf bitte deine Angaben und versuch es noch einmal.";
    return { fehler: meldung, email };
  }

  // Ohne Session wartet Supabase auf eine Bestätigungs-Mail – die Einstellung sollte aus sein.
  if (!data.session) {
    return {
      fehler:
        "Das Konto ist angelegt, aber du bist noch nicht angemeldet. Vermutlich verlangt Supabase noch eine Bestätigung per E-Mail.",
      email,
    };
  }

  revalidatePath("/", "layout");
  redirect(weiter);
}

export async function abmelden() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
