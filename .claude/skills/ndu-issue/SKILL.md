---
name: ndu-issue
description: Macht aus einem Satz ein fertiges Issue im Format von docs/BACKLOG.md und hängt es ans Backlog – danach fragt Claude, ob es priorisiert werden soll. Aufruf z. B. mit /ndu-issue Besitzer*innen sollen Anfragen ablehnen können
---

Aus einem Satz von mir wird ein Issue im Backlog. Mein Satz steht nach dem Aufruf (Argument). Fehlt er, frag: „Was soll die App können? Ein Satz reicht.“ und hör auf.

**Du schreibst nur in `docs/BACKLOG.md`.** Du setzt das Issue nicht um, fasst keinen Code und keine Datenbank an und führst `/ndu-commit` nicht selbst aus.

1. **Lesen.** Lies `docs/BACKLOG.md` (Format, Ton, höchste Issue-Nummer) und, falls vorhanden, `docs/PRODUKT.md` (Zielgruppe, „macht NICHT“).
2. **Abgleichen.** Prüf, ob ein bestehendes Issue das schon ganz oder teilweise abdeckt (auch ⬜ offene). Wenn ja: Sag es mit Nummer und Titel und frag, ob ich stattdessen dieses Issue ändern oder trotzdem ein neues will. Schreib dann erst nach meiner Antwort. Widerspricht mein Satz dem Brief („macht NICHT“, „Bewusst nicht“), sag das ebenfalls offen und frag nach.
3. **Rückfragen nur, wenn nötig.** Ist der Satz so unklar, dass du Ziel oder Negativfall raten müsstest, stell höchstens 2 Fragen mit je 2–3 Optionen. Sonst formulier direkt.
4. **Issue formulieren** – genau in dem Aufbau, den der Kopf von `docs/BACKLOG.md` beschreibt:
   - Überschrift: `### ⬜ Issue <nächste Nummer> — <kurzer Titel, 2–4 Wörter>`. Nächste Nummer = höchste vorhandene + 1.
   - **Ziel:** ein bis zwei Sätze: was danach möglich ist, für wen, warum („damit …“). Keine Satzform „Als … möchte ich …“.
   - **Nicht im Umfang:** was naheliegt, aber bewusst nicht dazugehört (kommagetrennt, kurz).
   - **Akzeptanzkriterien:** 3–5 Punkte im Format „Gegeben … wenn … dann …“. Mindestens ein Negativfall (falsche Eingabe, fehlende Berechtigung, Fehler beim Speichern). Hängt das Issue an Konten oder Datenbank, ist ein Kriterium dabei, wer etwas **nicht** sehen oder ändern darf (Row Level Security). Jedes Kriterium ist im Browser prüfbar, ohne Code zu lesen; Oberflächentexte sind ganze deutsche Sätze, geduzt.
   - **Fertig, wenn:** eine Zeile: was ich im Browser konkret tue und sehe, inklusive Negativfall und Handybreite (375 px), wenn die Oberfläche sich ändert.
   - Ein Issue = ein Durchgang. Ist der Wunsch größer, schlag vor, ihn in zwei Issues zu teilen, und frag.
5. **Anhängen.** Füge das Issue in `docs/BACKLOG.md` **vor** dem Abschnitt „Später / Ideen“ ein, unter der Überschrift `## Neu — noch nicht priorisiert` (lege sie an, falls es sie nicht gibt; mehrere neue Issues stehen untereinander darunter). Bestehende Issues änderst, verschiebst oder streichst du nicht. Steht die Idee schon unter „Später / Ideen“, entferne den Eintrag dort nicht, sondern erwähne es.
6. **Zeigen und fragen.** Zeig mir das fertige Issue (so wie es in der Datei steht) und sag in einem Satz, wo es steht. Frag dann: **„Soll ich es priorisieren – also in die Reihenfolge einsortieren, wann es dran ist?“** Biete 2–3 Optionen an, z. B. „als Nächstes“, „nach Issue X“ oder „bleibt unten, ich entscheide später“.
   - Antwortest du mit einer Position, verschieb **nur dieses** Issue dorthin (unter die passende Tages-Überschrift) und entferne die Überschrift „Neu — noch nicht priorisiert“, wenn sie leer ist.
7. **Abschluss.** Bitte mich, die Akzeptanzkriterien zu lesen und zu sagen, was ich ändern, streichen oder ergänzen will – in meinen Worten, du formulierst es um. Erst wenn sie passen, gebe ich selbst `/ndu-commit` ein. Nenn den Satz, mit dem ich das Issue später starte: „Setze Issue <Nummer> aus docs/BACKLOG.md um“.

Sprache: Deutsch, einfache Worte, keine Fachbegriffe ohne kurze Erklärung.
