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
      <section aria-label="Willkommen" className="mb-12 grid grid-cols-2 gap-0.5 border-2 border-border bg-fuge sm:grid-cols-3">
        <div
          className="erscheinen platte col-span-2 flex flex-col gap-4 bg-card p-6 pb-8 sm:p-10"
          style={{ "--i": 0 } as React.CSSProperties}
        >
          <h1 className="font-display text-[4rem] font-bold leading-[0.9] tracking-tight sm:text-8xl">leihbar.</h1>
          <p className="font-display text-2xl font-light sm:text-3xl">leihen statt kaufen.</p>
          <p className="max-w-md text-lg">
            Abendkleid für den Ball, Akkuschrauber fürs WG-Regal, Zelt fürs
            Festival – am Campus hat es schon jemand. Anbieten, finden, anfragen.
          </p>
        </div>
        <Link
          href="/anbieten"
          style={{ "--i": 1 } as React.CSSProperties}
          className="erscheinen platte flex min-h-32 items-end bg-accent p-5 font-display text-xl font-bold leading-tight transition hover:bg-foreground hover:text-card sm:col-span-1"
        >
          Gegenstand anbieten
        </Link>
        <a
          href="#gegenstaende"
          style={{ "--i": 2 } as React.CSSProperties}
          className="erscheinen platte flex min-h-32 items-end bg-blau p-5 font-display text-xl font-bold leading-tight text-card transition hover:bg-foreground"
        >
          Gegenstände ansehen
        </a>
      </section>

      <section id="gegenstaende" aria-labelledby="gegenstaende-titel">
        <h2 id="gegenstaende-titel" className="mb-4 font-display text-3xl font-bold sm:text-4xl">
          Das kannst du gerade ausleihen
        </h2>
        <KategorieFilter aktiv={aktiv} />
        {verfuegbar.length > 0 ? (
          <ul className="grid grid-cols-2 gap-0.5 border-2 border-border bg-fuge lg:grid-cols-3">
            {verfuegbar.map((gegenstand, index) => (
              <li
                key={gegenstand.id}
                className="erscheinen"
                style={{ "--i": Math.min(index + 3, 9) } as React.CSSProperties}
              >
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
