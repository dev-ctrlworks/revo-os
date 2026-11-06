import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/env";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/library",
  "/collections",
  "/connections",
  "/timeline",
  "/memory",
  "/capture",
  "/ask",
  "/settings",
];

const AUTH_PAGES = ["/sign-in", "/sign-up"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);

  // Without Supabase configured the app renders a setup notice rather than
  // enforcing auth redirects that could never succeed.
  if (!isSupabaseConfigured()) return response;

  const { pathname } = request.nextUrl;

  if (isProtected(pathname) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.search = "";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (AUTH_PAGES.includes(pathname) && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?)$).*)",
  ],
};
