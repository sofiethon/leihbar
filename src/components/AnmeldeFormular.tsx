"use client";

import { useActionState } from "react";
import { anmelden, registrieren } from "@/app/anmelden/actions";
import { leererAnmeldeZustand } from "@/lib/auth";

const feldKlasse =
  "min-h-11 w-full border-2 border-border bg-card px-3 py-2 text-base text-foreground";

export default function AnmeldeFormular({
  modus,
  weiter,
}: {
  modus: "anmelden" | "registrieren";
  weiter: string;
}) {
  const registriert = modus === "registrieren";
  const [zustand, formAction, laeuft] = useActionState(
    registriert ? registrieren : anmelden,
    leererAnmeldeZustand,
  );

  return (
    // noValidate: Die Meldungen kommen von uns, nicht vom Browser.
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <input type="hidden" name="weiter" value={weiter} />

      {zustand.fehler && (
        <div role="alert" className="border-2 border-border bg-card p-4">
          <p className="font-display font-extrabold">{zustand.fehler}</p>
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-1 block font-medium">
          E-Mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={zustand.email}
          className={feldKlasse}
        />
      </div>

      <div>
        <label htmlFor="passwort" className="mb-1 block font-medium">
          Passwort
        </label>
        <input
          id="passwort"
          name="passwort"
          type="password"
          autoComplete={registriert ? "new-password" : "current-password"}
          className={feldKlasse}
        />
        {registriert && <p className="mt-1 text-sm text-muted">Mindestens 6 Zeichen.</p>}
      </div>

      <button
        type="submit"
        disabled={laeuft}
        className="inline-flex min-h-11 items-center justify-center bg-foreground px-6 font-medium text-card transition hover:bg-card hover:text-foreground disabled:opacity-60 sm:self-start"
      >
        {laeuft ? "Einen Moment …" : registriert ? "Registrieren" : "Anmelden"}
      </button>
    </form>
  );
}
