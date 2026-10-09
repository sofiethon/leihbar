import { Heart } from "lucide-react";
import { merkenUmschalten } from "@/app/gemerkt/actions";

type Props = {
  itemId: string;
  titel: string;
  gemerkt: boolean;
  /** Seite, auf die man nach einer Anmeldung zurückkommt. */
  zurueck: string;
  /** „icon“ sitzt als runder Knopf auf der Karte, „text“ steht mit Beschriftung auf der Detailseite. */
  variante?: "icon" | "text";
};

export default function HerzButton({ itemId, titel, gemerkt, zurueck, variante = "icon" }: Props) {
  const herz = (
    <Heart
      size={20}
      aria-hidden="true"
      className={gemerkt ? "fill-accent" : "fill-transparent"}
    />
  );
  const aktion = merkenUmschalten.bind(null, itemId, zurueck);
  const beschriftung = gemerkt ? `${titel} nicht mehr merken` : `${titel} merken`;

  if (variante === "text") {
    return (
      <form action={aktion}>
        <button
          type="submit"
          aria-pressed={gemerkt}
          aria-label={beschriftung}
          className="inline-flex min-h-11 items-center gap-2 border-2 border-border bg-card px-4 font-medium transition hover:bg-accent-soft"
        >
          {herz}
          {gemerkt ? "Gemerkt" : "Merken"}
        </button>
      </form>
    );
  }

  return (
    <form action={aktion} className="absolute right-2 top-2 z-10">
      <button
        type="submit"
        aria-pressed={gemerkt}
        aria-label={beschriftung}
        className="flex min-h-11 min-w-11 items-center justify-center border-2 border-border bg-card transition hover:bg-accent-soft"
      >
        {herz}
      </button>
    </form>
  );
}
