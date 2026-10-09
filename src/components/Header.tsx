import Link from "next/link";
import { abmelden } from "@/app/anmelden/actions";
import { createClient } from "@/lib/supabase/server";

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b-2 border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex min-h-11 items-center gap-2 font-display text-2xl font-black tracking-tight">
          <span className="inline-block h-3 w-3 rounded-full border-2 border-border bg-accent" />
          leihbar.
        </Link>
        <nav aria-label="Hauptnavigation" className="flex min-w-0 items-center gap-3 text-sm text-muted sm:gap-4">
          <Link href="/#gegenstaende" className="hidden min-h-11 items-center hover:text-foreground sm:flex">
            Gegenstände
          </Link>
          <Link href="/anbieten" className="flex min-h-11 items-center hover:text-foreground">
            Anbieten
          </Link>
          {user ? (
            <>
              <Link
                href="/meine-anfragen"
                className="hidden min-h-11 items-center hover:text-foreground sm:flex"
              >
                Meine Anfragen
              </Link>
              <span className="min-w-0 max-w-24 truncate sm:max-w-48" title={user.email}>
                <span className="sr-only">Angemeldet als </span>
                {user.email}
              </span>
              <form action={abmelden}>
                <button
                  type="submit"
                  className="min-h-11 whitespace-nowrap border-2 border-border px-3 text-xs font-medium text-foreground hover:bg-card"
                >
                  Abmelden
                </button>
              </form>
            </>
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
