"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { kategorien } from "@/data/gegenstaende";
import type { AnbietenFeld, AnbietenZustand } from "@/lib/anbieten";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, name: AnbietenFeld) {
  const wert = formData.get(name);
  return typeof wert === "string" ? wert.trim() : "";
}

export async function gegenstandAnbieten(
  _vorher: AnbietenZustand,
  formData: FormData,
): Promise<AnbietenZustand> {
  const werte: AnbietenZustand["werte"] = {
    titel: text(formData, "titel"),
    kategorie: text(formData, "kategorie"),
    beschreibung: text(formData, "beschreibung"),
    ort: text(formData, "ort"),
    preis: text(formData, "preis"),
    besitzer: text(formData, "besitzer"),
  };
  const fehler: AnbietenZustand["fehler"] = {};

  if (!werte.titel) {
    fehler.titel = "Bitte gib einen Titel ein.";
  } else if (werte.titel.length > 100) {
    fehler.titel = "Der Titel darf höchstens 100 Zeichen lang sein.";
  }

  const kategorie = kategorien.find((name) => name === werte.kategorie);
  if (!kategorie) {
    fehler.kategorie = "Bitte wähle eine Kategorie aus.";
  }

  if (!werte.beschreibung) {
    fehler.beschreibung = "Bitte beschreibe den Gegenstand in ein, zwei Sätzen.";
  } else if (werte.beschreibung.length > 1000) {
    fehler.beschreibung = "Die Beschreibung darf höchstens 1000 Zeichen lang sein.";
  }

  if (!werte.ort) {
    fehler.ort = "Bitte gib an, wo man den Gegenstand abholen kann.";
  }

  if (!werte.besitzer) {
    fehler.besitzer = "Bitte gib deinen Namen ein.";
  }

  // Komma und Punkt als Dezimaltrenner erlauben („2,50“ oder „2.50“).
  const preis = Number(werte.preis.replace(",", "."));
  if (!werte.preis) {
    fehler.preis = "Bitte gib einen Preis pro Tag an – 0 bedeutet gratis.";
  } else if (!Number.isFinite(preis)) {
    fehler.preis = "Bitte gib den Preis als Zahl ein, zum Beispiel 5 oder 2,50.";
  } else if (preis < 0) {
    fehler.preis = "Der Preis darf nicht negativ sein. Für gratis gib 0 ein.";
  } else if (preis > 9999) {
    fehler.preis = "Der Preis pro Tag darf höchstens 9999 € betragen.";
  }

  if (Object.keys(fehler).length > 0 || !kategorie) {
    return { fehler, werte };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("items").insert({
    titel: werte.titel,
    kategorie,
    beschreibung: werte.beschreibung,
    ort: werte.ort,
    preis_pro_tag: preis,
    besitzer_name: werte.besitzer,
  });

  if (error) {
    return {
      fehler: { allgemein: "Das Speichern hat leider nicht geklappt. Versuch es bitte gleich noch einmal." },
      werte,
    };
  }

  revalidatePath("/");
  redirect("/#gegenstaende");
}
