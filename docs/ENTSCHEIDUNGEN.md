# Entscheidungen

> Hier hält Claude fest, was im Projekt festgelegt wurde, damit es in späteren Sessions noch gilt.
> Format: Datum — Entscheidung — Grund

- 2026-10-08 — Stack: Next.js + Tailwind + Supabase + Vercel — Kursvorgabe
- 2026-10-08 — Sprache der Oberfläche: Deutsch — Zielgruppe NDU-Studierende
- 2026-10-09 — Gegenstände liegen in der Supabase-Tabelle `items` (IDs sind UUIDs, `owner_id` bleibt bis Issue 5 leer, Besitzer*in steht als Text in `besitzer_name`). Row Level Security: alle dürfen lesen und anlegen, niemand ändern oder löschen — Issue 4
- 2026-10-09 — Bilder der Startdaten bleiben in `public/gegenstaende/` (`bild_url` zeigt auf den Pfad); neue Gegenstände haben kein Bild und zeigen einen Platzhalter, bis Foto-Upload kommt — Issue 4
