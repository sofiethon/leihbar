import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Nicht gefunden" };

export default function GegenstandNichtGefunden() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <h1 className="mb-3 text-3xl font-bold">Diesen Gegenstand gibt es nicht</h1>
      <p className="mb-6 text-muted">
        Vielleicht wurde er entfernt oder die Adresse stimmt nicht ganz. Schau
        in der Liste nach, was gerade zum Ausleihen da ist.
      </p>
      <Link
        href="/#gegenstaende"
        className="inline-flex min-h-11 items-center bg-foreground px-5 font-medium text-card transition hover:bg-blau"
      >
        Zur Liste
      </Link>
    </main>
  );
}
