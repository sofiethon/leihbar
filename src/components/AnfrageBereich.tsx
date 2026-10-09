import { Check } from "lucide-react";
import { anfrageUmschalten } from "@/app/gegenstaende/[id]/actions";
import type { AnfrageStatus } from "@/lib/anfragen";

const knopf =
  "inline-flex min-h-11 items-center justify-center gap-2 px-6 font-medium transition disabled:opacity-60";

export default function AnfrageBereich({
  itemId,
  verfuegbar,
  status,
}: {
  itemId: string;
  verfuegbar: boolean;
  status: AnfrageStatus;
}) {
  const { anzahl, angefragt, eigener } = status;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {eigener ? (
        <p className="text-muted">Das ist dein Gegenstand – du kannst ihn nicht selbst anfragen.</p>
      ) : (
        <form action={anfrageUmschalten.bind(null, itemId)}>
          <button
            type="submit"
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
          </button>
        </form>
      )}
      <p className="text-muted">
        Anfragen: <strong className="text-foreground">{anzahl}</strong>
      </p>
    </div>
  );
}
