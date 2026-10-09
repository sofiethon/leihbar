# Entscheidungen

> Hier hält Claude fest, was im Projekt festgelegt wurde, damit es in späteren Sessions noch gilt.
> Format: Datum — Entscheidung — Grund

- 2026-10-08 — Stack: Next.js + Tailwind + Supabase + Vercel — Kursvorgabe
- 2026-10-08 — Sprache der Oberfläche: Deutsch — Zielgruppe NDU-Studierende
- 2026-10-09 — Gegenstände liegen in der Supabase-Tabelle `items` (IDs sind UUIDs, `owner_id` bleibt bis Issue 5 leer, Besitzer*in steht als Text in `besitzer_name`). Row Level Security: alle dürfen lesen und anlegen, niemand ändern oder löschen — Issue 4
- 2026-10-09 — Bilder der Startdaten bleiben in `public/gegenstaende/` (`bild_url` zeigt auf den Pfad); neue Gegenstände haben kein Bild und zeigen einen Platzhalter, bis Foto-Upload kommt — Issue 4
- 2026-10-09 — Anmeldung über Supabase Auth mit E-Mail und Passwort (Bestätigungs-Mail in Supabase aus). `/anbieten` und `/meine-anfragen` sind nur angemeldet erreichbar (Proxy in `src/proxy.ts`). Row Level Security `items`: anlegen nur Angemeldete mit `owner_id` = eigene Nutzer-ID; lesen alle; ändern und löschen niemand — Issue 5
- 2026-10-09 — Anfragen liegen in der Supabase-Tabelle `requests` (`item_id`, `user_id`, je Person und Gegenstand nur eine). Row Level Security: lesen alle (für den Zähler), anlegen nur Angemeldete mit eigener `user_id`, löschen nur die eigene Anfrage, ändern niemand. Eigene Gegenstände und verliehene Gegenstände kann man nicht anfragen — Issue 6
- 2026-10-09 — Gemerkte Gegenstände liegen in der Supabase-Tabelle `favorites` (`item_id`, `user_id`, je Person und Gegenstand nur eine). Row Level Security: lesen, anlegen und löschen nur die eigenen Herzen (Angemeldete), ändern niemand, nicht Angemeldete haben gar keinen Zugriff. `/gemerkt` ist nur angemeldet erreichbar (Proxy). Auf dem Handy zeigt der Header „Gemerkt“ nur als Herz, das Logo ohne roten Punkt – sonst verschwindet die E-Mail — Issue 15
- 2026-10-09 — Der Header zeigt angemeldeten Personen „Anfragen an mich“ (Posteingang-Symbol) mit der Zahl offener Anfragen auf eigene Gegenstände, live per Realtime auf `requests` und `request_counts`. Die Seite `/anfragen-an-mich` listet die betroffenen Gegenstände und ist nur angemeldet erreichbar (Proxy). Keine Datenbankänderung nötig — Issue 11
