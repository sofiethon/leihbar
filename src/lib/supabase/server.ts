import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Für Server Components und Server Actions: pro Anfrage ein neuer Client
// (nie global speichern – sonst vermischen sich die Cookies verschiedener Besucher*innen).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Aus einer Server Component dürfen keine Cookies gesetzt werden.
            // Unkritisch: Der Proxy (src/proxy.ts) hält die Anmeldung aktuell.
          }
        },
      },
    },
  );
}
