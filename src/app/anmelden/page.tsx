import type { Metadata } from "next";
import Link from "next/link";
import AnmeldeFormular from "@/components/AnmeldeFormular";
import { sichereWeiterleitung } from "@/lib/auth";

export const metadata: Metadata = { title: "Anmelden" };

export default async function AnmeldenSeite({ searchParams }: PageProps<"/anmelden">) {
  const { weiter: weiterRoh, modus } = await searchParams;
  const weiter = sichereWeiterleitung(Array.isArray(weiterRoh) ? weiterRoh[0] : weiterRoh);
  const registrieren = modus === "registrieren";
  // Das Ziel (`weiter`) bleibt beim Wechsel zwischen Anmelden und Registrieren erhalten.
  const andererModus = new URLSearchParams();
  if (!registrieren) andererModus.set("modus", "registrieren");
  if (weiter !== "/") andererModus.set("weiter", weiter);
  const andererLink = `/anmelden${andererModus.size ? `?${andererModus}` : ""}`;

  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
      <h1 className="mb-2 font-display text-3xl font-extrabold sm:text-4xl">
        {registrieren ? "Konto anlegen" : "Anmelden"}
      </h1>
      <p className="mb-6 text-muted">
        {registrieren
          ? "Mit einem Konto kannst du Gegenstände anbieten und anfragen."
          : "Melde dich an, um Gegenstände anzubieten und anzufragen."}
      </p>
      <AnmeldeFormular modus={registrieren ? "registrieren" : "anmelden"} weiter={weiter} />
      <p className="mt-6 text-muted">
        {registrieren ? "Du hast schon ein Konto? " : "Du hast noch kein Konto? "}
        <Link
          href={andererLink}
          className="inline-flex min-h-11 items-center font-medium text-foreground underline"
        >
          {registrieren ? "Zur Anmeldung" : "Konto anlegen"}
        </Link>
      </p>
    </main>
  );
}
