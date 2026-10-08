import Image from "next/image";
import { MapPin, User } from "lucide-react";
import type { Gegenstand } from "@/data/gegenstaende";
import { preisText } from "@/lib/format";

type Props = {
  gegenstand: Gegenstand;
  /** Das erste sichtbare Bild wird sofort geladen. */
  prioritaet?: boolean;
};

export default function GegenstandKarte({ gegenstand, prioritaet = false }: Props) {
  const { titel, kategorie, preisProTag, ort, besitzer, bild } = gegenstand;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="relative aspect-[4/3] w-full bg-accent-soft">
        <Image
          src={bild}
          alt=""
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
          className="object-cover"
          priority={prioritaet}
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-sm text-muted">
          <span className="sr-only">Kategorie: </span>
          {kategorie}
        </p>
        <h3 className="font-semibold leading-snug">{titel}</h3>
        <p className="font-medium">{preisText(preisProTag)}</p>
        <dl className="mt-auto flex flex-col gap-1 pt-2 text-sm text-muted">
          <div className="flex items-start gap-2">
            <dt className="sr-only">Ort:</dt>
            <MapPin className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
            <dd>{ort}</dd>
          </div>
          <div className="flex items-start gap-2">
            <dt className="sr-only">Verleiht:</dt>
            <User className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
            <dd>{besitzer}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
