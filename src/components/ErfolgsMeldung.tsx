"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/** Kurze Bestätigung nach dem Anbieten; verschwindet nach ein paar Sekunden von selbst. */
export default function ErfolgsMeldung() {
  const reduziert = useReducedMotion();
  const [sichtbar, setSichtbar] = useState(true);

  useEffect(() => {
    // „neu“ aus der Adresse nehmen, damit ein Neuladen nichts mehr zeigt.
    const url = new URL(window.location.href);
    if (url.searchParams.has("neu")) {
      url.searchParams.delete("neu");
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    }
    const timer = setTimeout(() => setSichtbar(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex justify-center">
      <AnimatePresence>
        {sichtbar && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: reduziert ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduziert ? 0 : 0.3, ease: "easeOut" }}
            className="flex items-center gap-3 border-2 border-border bg-foreground px-4 py-3 font-display font-bold text-card"
          >
            <span className="flex size-8 shrink-0 items-center justify-center bg-accent text-foreground">
              <Check size={20} aria-hidden="true" />
            </span>
            Dein Gegenstand ist online.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
