import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b-2 border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-h-11 items-center gap-2 font-display text-2xl font-black tracking-tight">
          <span className="inline-block h-3 w-3 rounded-full border-2 border-border bg-accent" />
          leihbar.
        </Link>
        <nav aria-label="Hauptnavigation" className="flex items-center gap-4 text-sm text-muted">
          <Link href="/#gegenstaende" className="flex min-h-11 items-center hover:text-foreground">
            Gegenstände
          </Link>
          <span className="whitespace-nowrap rounded-full border border-border px-3 py-1 text-xs">
            Anmelden · Tag 2
          </span>
        </nav>
      </div>
    </header>
  );
}
