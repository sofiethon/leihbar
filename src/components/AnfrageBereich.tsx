"use client";

import { useEffect, useOptimistic, useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import { anfrageUmschalten } from "@/app/gegenstaende/[id]/actions";
import { createClient } from "@/lib/supabase/client";
import type { AnfrageStatus } from "@/lib/anfragen";

const knopf =
  "inline-flex min-h-11 items-center justify-center gap-2 px-6 font-medium transition disabled:opacity-60";

const NETZWERK_FEHLER =
  "Die Verbindung hat nicht geklappt, deine Anfrage wurde nicht gespeichert. Prüf deine Internetverbindung und versuch es noch einmal.";

type Zustand = { angefragt: boolean; anzahl: number };

// Button und Zähler reagieren sofort (useOptimistic). Die Zahl stammt aus der Datenbank und wird live
// nachgezählt – nie hochgezählt –, damit zusammen mit der Live-Aktualisierung nichts doppelt zählt.
export default function AnfrageBereich({
  itemId,
  verfuegbar,
  status,
}: {
  itemId: string;
  verfuegbar: boolean;
  status: AnfrageStatus;
}) {
  const { eigener } = status;
  const reduziert = useReducedMotion();
  const schuetteln = useAnimationControls();

  // Zahl laut Datenbank: kommt vom Server und wird live nachgeführt.
  const [live, setLive] = useState(status.anzahl);
  const [serverAnzahl, setServerAnzahl] = useState(status.anzahl);
  if (serverAnzahl !== status.anzahl) {
    setServerAnzahl(status.anzahl);
    setLive(status.anzahl);
  }

  const [fehler, setFehler] = useState<string | null>(null);
  const [zustand, setzeOptimistisch] = useOptimistic<Zustand, Zustand>(
    { angefragt: status.angefragt, anzahl: live },
    (_alt, neu) => neu,
  );

  useEffect(() => {
    const supabase = createClient();
    let aktiv = true;

    async function neuZaehlen() {
      const { data, error } = await supabase
        .from("request_counts")
        .select("anzahl")
        .eq("item_id", itemId)
        .maybeSingle();
      if (aktiv && !error) {
        setLive(data?.anzahl ?? 0);
      }
    }

    const kanal = supabase
      .channel(`anfragen-${itemId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "request_counts", filter: `item_id=eq.${itemId}` }, neuZaehlen)
      .subscribe();

    return () => {
      aktiv = false;
      supabase.removeChannel(kanal);
    };
  }, [itemId]);

  async function absenden() {
    setFehler(null);
    const neu = !zustand.angefragt;
    setzeOptimistisch({
      angefragt: neu,
      anzahl: Math.max(0, zustand.anzahl + (neu ? 1 : -1)),
    });

    let meldung: string | undefined;
    try {
      meldung = (await anfrageUmschalten(itemId)).fehler;
    } catch {
      meldung = NETZWERK_FEHLER;
    }
    if (meldung) {
      // Das Formular endet ohne neuen Stand – Button und Zähler springen von selbst zurück.
      setFehler(meldung);
      if (!reduziert) {
        schuetteln.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.3 } });
      }
    }
  }

  const { angefragt, anzahl } = zustand;
  const dauer = reduziert ? 0 : 0.2;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {eigener ? (
          <p className="text-muted">Das ist dein Gegenstand – du kannst ihn nicht selbst anfragen.</p>
        ) : (
          <form action={absenden}>
            <motion.button
              type="submit"
              animate={schuetteln}
              disabled={!verfuegbar && !angefragt}
              aria-pressed={angefragt}
              className={
                angefragt
                  ? `${knopf} border-2 border-border bg-card text-foreground hover:bg-accent-soft`
                  : `${knopf} bg-foreground text-card hover:bg-card hover:text-foreground`
              }
            >
              {angefragt ? (
                <>
                  Angefragt
                  <Check size={18} aria-hidden="true" />
                </>
              ) : (
                "Ausleihen anfragen"
              )}
            </motion.button>
          </form>
        )}
        <p className="text-muted" aria-live="polite">
          Anfragen:{" "}
          <span className="relative inline-block min-w-[1ch] align-bottom">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.strong
                key={anzahl}
                className="inline-block text-foreground"
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{ duration: dauer }}
              >
                {anzahl}
              </motion.strong>
            </AnimatePresence>
          </span>
        </p>
      </div>
      {fehler ? (
        <p role="alert" className="mt-2 font-medium">
          {fehler}
        </p>
      ) : null}
    </div>
  );
}
