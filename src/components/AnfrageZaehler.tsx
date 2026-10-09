"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Zeigt den Zähler „Anfragen“ und aktualisiert ihn live, sobald jemand anfragt oder zurückzieht.
// Bei jeder Änderung wird die Zahl neu abgefragt, damit nichts doppelt gezählt wird.
export default function AnfrageZaehler({
  itemId,
  start,
}: {
  itemId: string;
  start: number;
}) {
  const [anzahl, setAnzahl] = useState(start);

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
        setAnzahl(data?.anzahl ?? 0);
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

  return (
    <p className="text-muted" aria-live="polite">
      Anfragen: <strong className="text-foreground">{anzahl}</strong>
    </p>
  );
}
