"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Kategorie } from "@/data/gegenstaende";

type Eintrag = {
  id: string;
  kategorie: Kategorie;
  /** Die fertig gerenderte Karte (kommt vom Server). */
  karte: ReactNode;
};

type Props = {
  eintraege: Eintrag[];
  /** Aktuell gewählte Kategorie; ohne Angabe sind alle Karten sichtbar. */
  aktiv?: Kategorie;
  /** Gerade angebotener Gegenstand: bekommt kurz einen Rahmen. */
  neuId?: string;
};

export default function GegenstandListe({ eintraege, aktiv, neuId }: Props) {
  const reduziert = useReducedMotion();
  const [hervorgehoben, setHervorgehoben] = useState(neuId);
  useEffect(() => {
    if (!neuId) return;
    const timer = setTimeout(() => setHervorgehoben(undefined), 3500);
    return () => clearTimeout(timer);
  }, [neuId]);
  const sichtbar = aktiv ? eintraege.filter((eintrag) => eintrag.kategorie === aktiv) : eintraege;
  // Höchstens 0,4 s; mit „Bewegung reduzieren“ sofort.
  const uebergang = { duration: reduziert ? 0 : 0.35, ease: "easeOut" as const };

  if (sichtbar.length === 0) {
    return (
      <p className="border-2 border-dashed border-border bg-card p-8 text-center text-muted">
        Gerade ist nichts zum Ausleihen da. Biete doch du etwas an.{" "}
        <Link href="/anbieten" className="inline-flex min-h-11 items-center underline">
          Gegenstand anbieten
        </Link>
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-1 lg:grid-cols-3">
      <AnimatePresence mode="popLayout" initial={false}>
        {sichtbar.map((eintrag) => (
          <motion.li
            key={eintrag.id}
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={uebergang}
            className="relative"
          >
            {eintrag.karte}
            <AnimatePresence>
              {eintrag.id === hervorgehoben && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-10 border-4 border-blau"
                  initial={{ opacity: reduziert ? 1 : 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduziert ? 0 : 0.3 }}
                />
              )}
            </AnimatePresence>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
