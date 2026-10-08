import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, User } from "lucide-react";
import { gegenstaende } from "@/data/gegenstaende";
import { preisText } from "@/lib/format";

function findeGegenstand(id: string) {
  return gegenstaende.find((gegenstand) => gegenstand.id === id);
}

export async function generateMetadata({
  params,
}: PageProps<"/gegenstaende/[id]">): Promise<Metadata> {
  const { id } = await params;
  const gegenstand = findeGegenstand(id);
  return { title: gegenstand ? gegenstand.titel : "Nicht gefunden" };
}

export default async function GegenstandSeite({
  params,
}: PageProps<"/gegenstaende/[id]">) {
  const { id } = await params;
  const gegenstand = findeGegenstand(id);

  if (!gegenstand) {
    notFound();
  }

  const { titel, kategorie, beschreibung, besitzer, ort, preisProTag, verfuegbar, bild } =
    gegenstand;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <Link
        href="/#gegenstaende"
        className="mb-4 inline-flex min-h-11 items-center gap-2 text-muted hover:text-foreground"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Zurück zur Liste
      </Link>

      <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="relative aspect-[4/3] w-full bg-accent-soft">
          <Image
            src={bild}
            alt={titel}
            fill
            sizes="(min-width: 768px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="flex flex-col gap-4 p-6">
          <p className="text-sm text-muted">
            <span className="sr-only">Kategorie: </span>
            {kategorie}
          </p>
          <h1 className="text-3xl font-bold leading-tight">{titel}</h1>
          <p className="text-lg font-medium">{preisText(preisProTag)}</p>
          {!verfuegbar && (
            <p className="rounded-xl bg-accent-soft px-4 py-3 text-foreground">
              Dieser Gegenstand ist gerade verliehen.
            </p>
          )}
          <p className="leading-relaxed">{beschreibung}</p>
          <dl className="flex flex-col gap-2 text-muted">
            <div className="flex items-start gap-2">
              <dt className="sr-only">Ort:</dt>
              <MapPin className="mt-1 shrink-0" size={18} aria-hidden="true" />
              <dd>{ort}</dd>
            </div>
            <div className="flex items-start gap-2">
              <dt className="sr-only">Verleiht:</dt>
              <User className="mt-1 shrink-0" size={18} aria-hidden="true" />
              <dd>{besitzer}</dd>
            </div>
          </dl>
        </div>
      </article>
    </main>
  );
}
