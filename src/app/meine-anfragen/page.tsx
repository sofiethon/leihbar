import type { Metadata } from "next";

export const metadata: Metadata = { title: "Meine Anfragen" };

export default function MeineAnfragenSeite() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
      <h1 className="mb-2 font-display text-3xl font-extrabold sm:text-4xl">Meine Anfragen</h1>
      <p className="text-muted">Hier siehst du bald, was du angefragt hast.</p>
    </main>
  );
}
