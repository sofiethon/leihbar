import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Seiten, die nur Angemeldete sehen dürfen.
const geschuetzt = ["/meine-anfragen", "/anbieten", "/gemerkt"];

// Läuft vor jeder Seite: hält die Anmeldung aktuell und leitet Nicht-Angemeldete zur Anmeldung.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pfad = request.nextUrl.pathname;
  const brauchtLogin = geschuetzt.some((seite) => pfad === seite || pfad.startsWith(`${seite}/`));

  if (!user && brauchtLogin) {
    const ziel = request.nextUrl.clone();
    ziel.pathname = "/anmelden";
    ziel.search = `?weiter=${encodeURIComponent(pfad)}`;
    const umleitung = NextResponse.redirect(ziel);
    response.cookies.getAll().forEach((cookie) => umleitung.cookies.set(cookie));
    return umleitung;
  }

  return response;
}

export const config = {
  // Nicht für Bilder, Schriften und andere Dateien.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
