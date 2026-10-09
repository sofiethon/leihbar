"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Heart, Inbox, LogOut, Send, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const eintragKlassen =
  "flex min-h-11 w-full items-center gap-3 px-4 text-left text-sm text-foreground hover:bg-accent-soft";

// Aufklappmenü rechts im Header: E-Mail als Auslöser, darin die persönlichen Links.
// Die Zahl offener Anfragen auf meine Gegenstände wird live nachgezählt und schon am Auslöser angezeigt.
export default function KontoMenue({
  userId,
  email,
  start,
  abmelden,
}: {
  userId: string;
  email: string;
  start: number;
  abmelden: () => void | Promise<void>;
}) {
  const [offen, setOffen] = useState(false);
  const [anzahl, setAnzahl] = useState(start);
  const huelle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    let aktiv = true;

    async function neuZaehlen() {
      const { count, error } = await supabase
        .from("requests")
        .select("id, items!inner (owner_id)", { count: "exact", head: true })
        .eq("status", "offen")
        .eq("items.owner_id", userId);
      if (aktiv && !error) {
        setAnzahl(count ?? 0);
      }
    }

    // `requests` meldet neue und beantwortete Anfragen, `request_counts` auch zurückgezogene.
    const kanal = supabase
      .channel(`anfragen-hinweis-${userId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "requests" }, neuZaehlen)
      .on("postgres_changes", { event: "*", schema: "public", table: "request_counts" }, neuZaehlen)
      .subscribe();

    return () => {
      aktiv = false;
      supabase.removeChannel(kanal);
    };
  }, [userId]);

  // Schließen per Klick daneben oder Escape-Taste.
  useEffect(() => {
    if (!offen) return;
    function klickDaneben(e: MouseEvent) {
      if (huelle.current && !huelle.current.contains(e.target as Node)) setOffen(false);
    }
    function taste(e: KeyboardEvent) {
      if (e.key === "Escape") setOffen(false);
    }
    document.addEventListener("mousedown", klickDaneben);
    document.addEventListener("keydown", taste);
    return () => {
      document.removeEventListener("mousedown", klickDaneben);
      document.removeEventListener("keydown", taste);
    };
  }, [offen]);

  return (
    <div ref={huelle} className="relative">
      <button
        type="button"
        onClick={() => setOffen((o) => !o)}
        aria-expanded={offen}
        aria-controls="konto-menue"
        aria-label="Konto-Menü"
        className="relative flex min-h-11 items-center gap-2 border-2 border-border px-2 text-sm text-foreground hover:bg-card sm:px-3"
      >
        <User size={18} aria-hidden="true" className="sm:hidden" />
        <span className="hidden max-w-40 truncate sm:inline" title={email}>
          {email}
        </span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`transition-transform duration-200 ${offen ? "rotate-180" : ""}`}
        />
        {anzahl > 0 && (
          <span
            className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-xs font-bold text-card"
            aria-live="polite"
          >
            {anzahl}
            <span className="sr-only"> offene Anfragen</span>
          </span>
        )}
      </button>

      {offen && (
        <div
          id="konto-menue"
          className="absolute right-0 top-full z-20 mt-2 w-64 max-w-[calc(100vw-2rem)] border-2 border-border bg-card py-1"
        >
          <p className="truncate px-4 py-2 text-xs text-muted" title={email}>
            <span className="sr-only">Angemeldet als </span>
            {email}
          </p>
          <ul className="border-t-2 border-border">
            <li>
              <Link href="/meine-anfragen" onClick={() => setOffen(false)} className={eintragKlassen}>
                <Send size={18} aria-hidden="true" />
                Meine Anfragen
              </Link>
            </li>
            <li>
              <Link href="/anfragen-an-mich" onClick={() => setOffen(false)} className={eintragKlassen}>
                <Inbox size={18} aria-hidden="true" />
                Anfragen an mich
                {anzahl > 0 && (
                  <span className="ml-auto flex min-h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-xs font-bold text-card">
                    {anzahl}
                    <span className="sr-only"> offene Anfragen</span>
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link href="/gemerkt" onClick={() => setOffen(false)} className={eintragKlassen}>
                <Heart size={18} aria-hidden="true" />
                Gemerkt
              </Link>
            </li>
            <li className="border-t-2 border-border">
              <form action={abmelden}>
                <button type="submit" className={eintragKlassen}>
                  <LogOut size={18} aria-hidden="true" />
                  Abmelden
                </button>
              </form>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
