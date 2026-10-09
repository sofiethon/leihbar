import type { Metadata } from "next";
import Link from "next/link";
import GegenstandKarte from "@/components/GegenstandKarte";
import { ladeGemerkteGegenstaende } from "@/lib/favoriten";

export const metadata: Metadata = { title: "Gemerkt" };

export default async function GemerktSeite() {
  const gegenstaende = await ladeGemerkteGegenstaende();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-extrabold sm:text-4xl">Gemerkt</h1>
      {gegenstaende.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gegenstaende.map((gegenstand, index) => (
            <li key={gegenstand.id}>
              <GegenstandKarte
                gegenstand={gegenstand}
                titelEbene="h2"
                gemerkt
                zurueck="/gemerkt"
                prioritaet={index === 0}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-2 border-dashed border-border bg-card p-8 text-center text-muted">
          Du hast noch nichts gemerkt. Tipp in der Liste auf das Herz, um dir etwas aufzuheben.{" "}
          <Link href="/#gegenstaende" className="inline-flex min-h-11 items-center underline">
            Zur Liste
          </Link>
        </p>
      )}
    </main>
  );
}
