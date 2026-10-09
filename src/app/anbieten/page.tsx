import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AnbietenFormular from "@/components/AnbietenFormular";

export const metadata: Metadata = { title: "Gegenstand anbieten" };

export default function AnbietenSeite() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
      <Link
        href="/#gegenstaende"
        className="mb-4 inline-flex min-h-11 items-center gap-2 text-muted hover:text-foreground"
      >
        <ArrowLeft size={18} aria-hidden="true" />
        Zurück zur Liste
      </Link>
      <h1 className="mb-2 font-display text-3xl font-extrabold sm:text-4xl">
        Gegenstand anbieten
      </h1>
      <p className="mb-6 text-muted">
        Was hast du, das andere am Campus ausleihen können? Sobald du speicherst,
        steht es in der Liste. Ein Bild kannst du noch nicht hochladen, bis dahin
        zeigt die Liste einen Platzhalter.
      </p>
      <AnbietenFormular />
    </main>
  );
}
