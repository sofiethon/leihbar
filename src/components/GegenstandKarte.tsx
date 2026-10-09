import Link from "next/link";
import { MapPin, User } from "lucide-react";
import GegenstandBild from "@/components/GegenstandBild";
import HerzButton from "@/components/HerzButton";
import type { Gegenstand } from "@/data/gegenstaende";
import { preisText } from "@/lib/format";

type Props = {
  gegenstand: Gegenstand;
  /** Das erste sichtbare Bild wird sofort geladen. */
  prioritaet?: boolean;
  /** Welche Überschrift der Titel ist – passend zur Seite, auf der die Karte steht. */
  titelEbene?: "h2" | "h3";
  /** Ob die angemeldete Person den Gegenstand gemerkt hat. */
  gemerkt?: boolean;
  /** Seite, auf die man nach der Anmeldung vom Herz zurückkommt. */
  zurueck?: string;
};

export default function GegenstandKarte({ gegenstand, prioritaet = false, titelEbene: Titel = "h3", gemerkt = false, zurueck = "/" }: Props) {
  const { id, titel, kategorie, preisProTag, ort, besitzer, bild } = gegenstand;

  return (
    <article className="platte flex h-full min-w-0 flex-col overflow-hidden break-words hyphens-auto bg-card transition hover:bg-accent-soft focus-within:bg-accent-soft">
      <div className="relative aspect-square w-full bg-accent-soft">
        <GegenstandBild
          bild={bild}
          alt=""
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
          prioritaet={prioritaet}
        />
        <p className="absolute bottom-0 left-0 bg-accent px-3 py-1 font-display font-bold text-foreground">
          {preisText(preisProTag)}
        </p>
      </div>
      <HerzButton itemId={id} titel={titel} gemerkt={gemerkt} zurueck={zurueck} />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-sm text-muted">
          <span className="sr-only">Kategorie: </span>
          {kategorie}
        </p>
        <Titel className="font-display text-xl font-bold leading-tight">
          {/* Der unsichtbare Überzug (after:) macht die ganze Karte anklickbar. */}
          <Link href={`/gegenstaende/${id}`} className="after:absolute after:inset-0">
            {titel}
          </Link>
        </Titel>
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
