"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// Link „Anfragen an mich“ im Header mit der Zahl offener Anfragen auf meine Gegenstände.
// Bei jeder Änderung wird neu gezählt, damit die Zahl immer stimmt.
export default function AnfragenHinweis({ userId, start }: { userId: string; start: number }) {
  const [anzahl, setAnzahl] = useState(start);

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

  return (
    <Link
      href="/anfragen-an-mich"
      className="relative flex min-h-11 items-center gap-2 hover:text-foreground max-sm:min-w-11 max-sm:justify-center"
    >
      <Inbox size={18} aria-hidden="true" />
      <span className="sr-only sm:not-sr-only">Anfragen an mich</span>
      {anzahl > 0 && (
        <span
          className="absolute right-0 top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-xs font-bold text-card sm:static"
          aria-live="polite"
        >
          {anzahl}
          <span className="sr-only"> offene Anfragen</span>
        </span>
      )}
    </Link>
  );
}
