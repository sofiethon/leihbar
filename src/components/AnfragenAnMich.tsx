import { anfrageBeantworten } from "@/app/gegenstaende/[id]/actions";
import type { AnfrageAnMich } from "@/lib/anfragen";

const knopf =
  "inline-flex min-h-11 items-center justify-center border-2 border-border px-4 font-medium transition";

export default function AnfragenAnMich({
  itemId,
  anfragen,
}: {
  itemId: string;
  anfragen: AnfrageAnMich[];
}) {
  return (
    <section aria-labelledby="anfragen-an-mich" className="flex flex-col gap-3">
      <h2 id="anfragen-an-mich" className="font-display text-xl font-extrabold">
        Anfragen an dich
      </h2>
      {anfragen.length === 0 ? (
        <p className="text-muted">Noch hat niemand angefragt.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {anfragen.map((anfrage) => (
            <li
              key={anfrage.id}
              className="flex flex-wrap items-center justify-between gap-3 border-2 border-border bg-card p-3"
            >
              <p className="break-all">
                <span className="sr-only">Von: </span>
                {anfrage.email}
                <span className="ml-2 text-sm text-muted">({anfrage.status})</span>
              </p>
              <div className="flex gap-2">
                <form action={anfrageBeantworten.bind(null, itemId, anfrage.id, "angenommen")}>
                  <button
                    type="submit"
                    disabled={anfrage.status === "angenommen"}
                    className={`${knopf} bg-foreground text-card hover:bg-card hover:text-foreground disabled:opacity-60`}
                  >
                    Annehmen
                  </button>
                </form>
                <form action={anfrageBeantworten.bind(null, itemId, anfrage.id, "abgelehnt")}>
                  <button
                    type="submit"
                    disabled={anfrage.status === "abgelehnt"}
                    className={`${knopf} bg-card hover:bg-accent-soft disabled:opacity-60`}
                  >
                    Ablehnen
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
