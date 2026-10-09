"use client";

import { useActionState } from "react";
import { kategorien } from "@/data/gegenstaende";
import { gegenstandAnbieten } from "@/app/anbieten/actions";
import { leererZustand, type AnbietenFeld } from "@/lib/anbieten";

const feldKlasse =
  "min-h-11 w-full border-2 border-border bg-card px-3 py-2 text-base text-foreground";

export default function AnbietenFormular() {
  const [zustand, formAction, laeuft] = useActionState(gegenstandAnbieten, leererZustand);
  const { fehler, werte } = zustand;
  const fehlerListe = Object.entries(fehler);

  // Gemeinsame Eigenschaften eines Felds: Fehlermeldung wird vom Eingabefeld aus angesagt.
  const feld = (name: AnbietenFeld) => ({
    id: name,
    name,
    "aria-invalid": fehler[name] ? true : undefined,
    "aria-describedby": fehler[name] ? `${name}-fehler` : undefined,
    className: `${feldKlasse} ${fehler[name] ? "border-4" : ""}`,
  });
  const meldung = (name: AnbietenFeld) =>
    fehler[name] ? (
      <p id={`${name}-fehler`} className="mt-1 text-sm font-medium">
        {fehler[name]}
      </p>
    ) : null;

  return (
    // noValidate: Die Meldungen kommen von uns, nicht vom Browser.
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {fehlerListe.length > 0 && (
        <div role="alert" className="border-2 border-border bg-card p-4">
          <p className="font-display font-extrabold">
            {fehler.allgemein ?? "Bitte prüfe deine Angaben – gespeichert wurde noch nichts."}
          </p>
        </div>
      )}

      <div>
        <label htmlFor="titel" className="mb-1 block font-medium">
          Titel
        </label>
        <input type="text" defaultValue={werte.titel} autoComplete="off" {...feld("titel")} />
        {meldung("titel")}
      </div>

      <div>
        <label htmlFor="kategorie" className="mb-1 block font-medium">
          Kategorie
        </label>
        {/* key: Nach einem Fehler setzt der Browser das Formular zurück; mit neuem key wird die Auswahl neu übernommen. */}
        <select
          key={`kategorie-${werte.kategorie}`}
          defaultValue={werte.kategorie}
          {...feld("kategorie")}
        >
          <option value="">Bitte wählen</option>
          {kategorien.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        {meldung("kategorie")}
      </div>

      <div>
        <label htmlFor="beschreibung" className="mb-1 block font-medium">
          Beschreibung
        </label>
        <textarea rows={4} defaultValue={werte.beschreibung} {...feld("beschreibung")} />
        {meldung("beschreibung")}
      </div>

      <div>
        <label htmlFor="ort" className="mb-1 block font-medium">
          Ort der Abholung
        </label>
        <input type="text" defaultValue={werte.ort} autoComplete="off" {...feld("ort")} />
        {meldung("ort")}
      </div>

      <div>
        <label htmlFor="preis" className="mb-1 block font-medium">
          Preis pro Tag in Euro
        </label>
        <input
          type="text"
          inputMode="decimal"
          defaultValue={werte.preis}
          autoComplete="off"
          {...feld("preis")}
        />
        <p className="mt-1 text-sm text-muted">0 bedeutet gratis.</p>
        {meldung("preis")}
      </div>

      <div>
        <label htmlFor="besitzer" className="mb-1 block font-medium">
          Dein Name
        </label>
        <input type="text" defaultValue={werte.besitzer} autoComplete="given-name" {...feld("besitzer")} />
        {meldung("besitzer")}
      </div>

      <button
        type="submit"
        disabled={laeuft}
        className="inline-flex min-h-11 items-center justify-center bg-foreground px-6 font-medium text-card transition hover:bg-card hover:text-foreground disabled:opacity-60 sm:self-start"
      >
        {laeuft ? "Wird gespeichert …" : "Gegenstand anbieten"}
      </button>
    </form>
  );
}
