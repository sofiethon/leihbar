import type { Metadata } from "next";
import Link from "next/link";
import { ladeOffeneAnfragenAnMich } from "@/lib/anfragen";

export const metadata: Metadata = { title: "Anfragen an mich" };

export default async function AnfragenAnMichSeite() {
  const eintraege = await ladeOffeneAnfragenAnMich();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-extrabold sm:text-4xl">Anfragen an mich</h1>
      {eintraege.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {eintraege.map(({ gegenstand, anzahl }) => (
            <li key={gegenstand.id}>
              <article className="flex flex-wrap items-center justify-between gap-3 border-2 border-border bg-card p-4">
                <div>
                  <h2 className="font-display text-xl font-extrabold">{gegenstand.titel}</h2>
                  <p className="text-muted">
                    {anzahl === 1 ? "1 offene Anfrage" : `${anzahl} offene Anfragen`}
                  </p>
                </div>
                <Link
                  href={`/gegenstaende/${gegenstand.id}`}
                  className="inline-flex min-h-11 items-center justify-center border-2 border-border bg-foreground px-4 font-medium text-card hover:bg-card hover:text-foreground"
                >
                  Anfragen ansehen
                  <span className="sr-only"> zu {gegenstand.titel}</span>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border-2 border-dashed border-border bg-card p-8 text-center text-muted">
          Auf deine Gegenstände wartet keine offene Anfrage. Schau in die Liste, was andere anbieten.{" "}
          <Link href="/#gegenstaende" className="inline-flex min-h-11 items-center underline">
            Zur Liste
          </Link>
        </p>
      )}
    </main>
  );
}
