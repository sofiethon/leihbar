import Link from "next/link";
import { abmelden } from "@/app/anmelden/actions";
import KontoMenue from "@/components/KontoMenue";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: offeneAnfragen } = user
    ? await supabase
        .from("requests")
        .select("id, items!inner (owner_id)", { count: "exact", head: true })
        .eq("status", "offen")
        .eq("items.owner_id", user.id)
    : { count: 0 };

  return (
    <header className="border-b-2 border-border bg-background">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-h-11 items-center border-2 border-border bg-rot px-3 font-display text-2xl font-bold tracking-tight text-card">
          leihbar.
        </Link>
        <nav aria-label="Hauptnavigation" className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground sm:gap-4">
          <Link href="/#gegenstaende" className="hidden min-h-11 items-center underline-offset-4 hover:underline sm:flex">
            Gegenstände
          </Link>
          <Link href="/anbieten" className="flex min-h-11 items-center underline-offset-4 hover:underline">
            Anbieten
          </Link>
          {user ? (
            <KontoMenue
              userId={user.id}
              email={user.email ?? ""}
              start={offeneAnfragen ?? 0}
              abmelden={abmelden}
            />
          ) : (
            <Link
              href="/anmelden"
              className="flex min-h-11 items-center whitespace-nowrap border-2 border-border bg-blau px-4 text-sm font-medium text-card transition hover:bg-foreground"
            >
              Anmelden
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
