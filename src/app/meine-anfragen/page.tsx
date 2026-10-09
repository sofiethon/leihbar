import type { Metadata } from "next";
import Link from "next/link";
import GegenstandKarte from "@/components/GegenstandKarte";
import { ladeMeineAnfragen } from "@/lib/anfragen";

export const metadata: Metadata = { title: "Meine Anfragen" };

export default async function MeineAnfragenSeite() {
  const gegenstaende = await ladeMeineAnfragen();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-extrabold sm:text-4xl">Meine Anfragen</h1>
      {gegenstaende.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gegenstaende.map((gegenstand) => (
            <li key={gegenstand.id}>
              <GegenstandKarte gegenstand={gegenstand} titelEbene="h2" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-2 border-dashed border-border bg-card p-8 text-center text-muted">
          Du hast noch nichts angefragt. Schau in die Liste, was du ausleihen kannst.{" "}
          <Link href="/#gegenstaende" className="inline-flex min-h-11 items-center underline">
            Zur Liste
          </Link>
        </p>
      )}
    </main>
  );
}
