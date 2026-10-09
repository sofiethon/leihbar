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
    <header className="border-b-2 border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-h-11 items-center gap-2 font-display text-xl font-black tracking-tight sm:text-2xl">
          <span className="hidden h-3 w-3 rounded-full border-2 border-border bg-accent sm:inline-block" />
          leihbar.
        </Link>
        <nav aria-label="Hauptnavigation" className="flex min-w-0 items-center gap-2 text-sm text-muted sm:gap-4">
          <Link href="/#gegenstaende" className="hidden min-h-11 items-center hover:text-foreground sm:flex">
            Gegenstände
          </Link>
          <Link href="/anbieten" className="flex min-h-11 items-center hover:text-foreground">
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
              className="flex min-h-11 items-center whitespace-nowrap border-2 border-border px-3 text-xs font-medium text-foreground hover:bg-card"
            >
              Anmelden
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
