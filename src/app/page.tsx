import Link from "next/link";
import GegenstandKarte from "@/components/GegenstandKarte";
import KategorieFilter from "@/components/KategorieFilter";
import { kategorien } from "@/data/gegenstaende";
import { ladeGemerkteIds } from "@/lib/favoriten";
import { ladeVerfuegbareGegenstaende } from "@/lib/gegenstaende";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { kategorie } = await searchParams;
  // Nur eine bekannte Kategorie gilt als Filter; alles andere zeigt „Alle“.
  const aktiv = kategorien.find((name) => name === kategorie);
  const [verfuegbar, gemerkt] = await Promise.all([ladeVerfuegbareGegenstaende(aktiv), ladeGemerkteIds()]);
  const zurueck = aktiv ? `/?kategorie=${encodeURIComponent(aktiv)}` : "/";

  return (
    <main id="top" className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:block">
      {/* Beim Scrollen fahren Gelb, Blau und Schwarz unter der weißen Platte hervor (siehe .rolle in globals.css). */}
      <section aria-label="Willkommen" className="rolle mb-12">
        <div className="buehne flex flex-col gap-1">
          <div className="platte z-10 flex flex-col gap-3 border-2 border-border bg-card px-6 pb-10 pt-8 sm:gap-5 sm:px-12 sm:pb-16 sm:pt-12">
            <h1 className="font-display text-[4.75rem] font-bold leading-[0.9] tracking-tight sm:text-[9rem] lg:text-[12rem]">
              leihbar.
            </h1>
            <p className="font-display text-2xl font-light sm:text-5xl">leihen statt kaufen.</p>
          </div>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
            <Link
              href="/anbieten"
              className="rolle-gelb platte z-[2] flex min-h-28 items-end border-2 border-border bg-accent p-4 font-display text-lg font-bold leading-tight sm:p-5 sm:text-xl transition hover:bg-foreground hover:text-card"
            >
              Gegenstand anbieten
            </Link>
            <a
              href="#gegenstaende"
              className="rolle-blau platte z-[2] flex min-h-28 items-end border-2 border-border bg-blau p-4 font-display text-lg font-bold leading-tight sm:p-5 sm:text-xl text-card transition hover:bg-foreground"
            >
              Gegenstände ansehen
            </a>
            <ul className="rolle-schwarz platte z-[1] col-span-2 flex flex-col justify-end gap-1 border-2 border-border bg-foreground p-5 font-display text-lg font-bold leading-tight text-card sm:col-span-1">
              <li>Alles an einem Ort</li>
              <li>Mit einem Klick anfragen</li>
              <li>Leihen statt kaufen</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="gegenstaende" aria-labelledby="gegenstaende-titel" className="scroll-mt-24">
        <h2 id="gegenstaende-titel" className="mb-4 font-display text-3xl font-bold sm:text-4xl">
          Das kannst du gerade ausleihen
        </h2>
        <KategorieFilter aktiv={aktiv} />
        {verfuegbar.length > 0 ? (
          <ul className="grid grid-cols-2 gap-1 lg:grid-cols-3">
            {verfuegbar.map((gegenstand) => (
              <li key={gegenstand.id}>
                <GegenstandKarte gegenstand={gegenstand} gemerkt={gemerkt.has(gegenstand.id)} zurueck={zurueck} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-2 border-dashed border-border bg-card p-8 text-center text-muted">
            Gerade ist nichts zum Ausleihen da. Biete doch du etwas an.{" "}
            <Link href="/anbieten" className="inline-flex min-h-11 items-center underline">
              Gegenstand anbieten
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
