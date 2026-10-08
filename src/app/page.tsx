import { Hand, Recycle, Search } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import GegenstandKarte from "@/components/GegenstandKarte";
import KategorieFilter from "@/components/KategorieFilter";
import { gegenstaende, kategorien } from "@/data/gegenstaende";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { kategorie } = await searchParams;
  // Nur eine bekannte Kategorie gilt als Filter; alles andere zeigt „Alle“.
  const aktiv = kategorien.find((name) => name === kategorie);
  const verfuegbar = gegenstaende.filter(
    (gegenstand) => gegenstand.verfuegbar && (!aktiv || gegenstand.kategorie === aktiv),
  );

  return (
    <main id="top" className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:block">
      <section className="mb-14 overflow-hidden border-2 border-border">
        <div className="erscheinen flex flex-col justify-between gap-8 p-6 sm:p-10">
          <p className="inline-block self-start border-2 border-border bg-card px-3 py-1 text-sm font-medium">
            NDU · Wintersemester 2026
          </p>
          {/* @container: die Überschrift misst sich an der Breite dieses Kastens und füllt ihn. */}
          <div className="@container">
            <p className="mb-2 font-display text-2xl font-medium sm:text-4xl">
              leihen statt kaufen.
            </p>
            <h1 className="font-display text-[27cqw] font-black leading-[0.85] tracking-tight">
              leihbar.
            </h1>
          </div>
          <p className="max-w-md text-lg text-muted">
            Abendkleid für den Ball, Akkuschrauber fürs WG-Regal, Zelt fürs
            Festival – am Campus hat es schon jemand. Anbieten, finden, anfragen.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#gegenstaende"
              className="inline-flex min-h-11 items-center bg-foreground px-6 font-medium text-card transition hover:bg-card hover:text-foreground"
            >
              Gegenstände ansehen
            </a>
            <span className="inline-flex min-h-11 items-center border-2 border-border px-5 text-muted">
              Anbieten – kommt an Tag 2
            </span>
          </div>
        </div>
      </section>

      <section aria-label="Was Leihbar kann" className="order-last mb-14 grid gap-4 sm:order-none sm:grid-cols-3">
        <FeatureCard
          icon={Search}
          titel="Alles an einem Ort"
          text="Was andere am Campus verleihen – von Mode über Möbel bis Technik, ohne Herumfragen in Chats."
        />
        <FeatureCard
          icon={Hand}
          titel="Mit einem Klick anfragen"
          text="Besitzer*innen sehen sofort, wer etwas ausleihen möchte. Kein Hin und Her mehr."
        />
        <FeatureCard
          icon={Recycle}
          titel="Leihen statt kaufen"
          text="Für einmal kaufen lohnt sich selten. Leihen spart Geld und Platz in der WG."
        />
      </section>

      <section id="gegenstaende" aria-labelledby="gegenstaende-titel">
        <h2 id="gegenstaende-titel" className="mb-4 font-display text-3xl font-extrabold sm:text-4xl">
          Das kannst du gerade ausleihen
        </h2>
        <KategorieFilter aktiv={aktiv} />
        {verfuegbar.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {verfuegbar.map((gegenstand, index) => (
              <li
                key={gegenstand.id}
                className="erscheinen"
                style={{ "--i": Math.min(index + 5, 10) } as React.CSSProperties}
              >
                <GegenstandKarte gegenstand={gegenstand} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-2 border-dashed border-border bg-card p-8 text-center text-muted">
            Gerade ist nichts zum Ausleihen da. Schau bald wieder vorbei.{" "}
            <a href="#top" className="inline-flex min-h-11 items-center underline">
              Zurück nach oben
            </a>
          </p>
        )}
      </section>
    </main>
  );
}
