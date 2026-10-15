"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { kategorien, type Kategorie } from "@/data/gegenstaende";

type Props = {
  /** Aktuell gewählte Kategorie; ohne Angabe ist „Alle“ aktiv. */
  aktiv?: Kategorie;
};

const basis =
  "relative inline-flex min-h-11 items-center border-2 border-border px-5 text-sm font-medium transition";
const gewaehlt = "bg-card font-bold text-foreground";
const ungewaehlt = "bg-card text-foreground hover:bg-accent-soft";

export default function KategorieFilter({ aktiv }: Props) {
  const reduziert = useReducedMotion();
  const uebergang = { duration: reduziert ? 0 : 0.3, ease: "easeOut" as const };

  // Die gelbe Markierung liegt hinter dem Text des aktiven Filters und gleitet beim Wechsel mit.
  const markierung = (
    <motion.span
      layoutId="filter-markierung"
      transition={uebergang}
      className="absolute -inset-0.5 bg-accent"
      aria-hidden="true"
    />
  );

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
            {!aktiv && markierung}
            <span className="relative">Alle</span>
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
              {aktiv === name && markierung}
              <span className="relative">{name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
