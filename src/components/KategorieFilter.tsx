import Link from "next/link";
import { kategorien, type Kategorie } from "@/data/gegenstaende";

type Props = {
  /** Aktuell gewählte Kategorie; ohne Angabe ist „Alle“ aktiv. */
  aktiv?: Kategorie;
};

const basis =
  "inline-flex min-h-11 items-center rounded-full border-2 px-5 text-sm font-medium transition";
const gewaehlt = "border-border bg-foreground text-card";
const ungewaehlt = "border-border bg-background text-foreground hover:bg-card";

export default function KategorieFilter({ aktiv }: Props) {
  return (
    <nav aria-label="Nach Kategorie filtern" className="mb-6">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/#gegenstaende"
            scroll={false}
            aria-current={!aktiv ? "true" : undefined}
            className={`${basis} ${!aktiv ? gewaehlt : ungewaehlt}`}
          >
            Alle
          </Link>
        </li>
        {kategorien.map((name) => (
          <li key={name}>
            <Link
              href={`/?kategorie=${encodeURIComponent(name)}#gegenstaende`}
              scroll={false}
              aria-current={aktiv === name ? "true" : undefined}
              className={`${basis} ${aktiv === name ? gewaehlt : ungewaehlt}`}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
