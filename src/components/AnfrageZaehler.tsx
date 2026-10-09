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
      const { count, error } = await supabase
        .from("requests")
        .select("id", { count: "exact", head: true })
        .eq("item_id", itemId);
      if (aktiv && !error && count !== null) {
        setAnzahl(count);
      }
    }

    const kanal = supabase
      .channel(`anfragen-${itemId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "requests" }, neuZaehlen)
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
