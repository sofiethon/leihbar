import { createBrowserClient } from "@supabase/ssr";

// Für Client Components (läuft im Browser), z. B. für Live-Updates.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
