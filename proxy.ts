import { NextRequest, NextResponse } from "next/server";
import { defaultLocale } from "@/lib/i18n/config";

const SESSION_COOKIE = "portfolio_admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect the bare root to the default locale.
  if (pathname === "/") {
    const preferred =
      request.cookies.get("preferred_locale")?.value === "ar"
        ? "ar"
        : defaultLocale;
    return NextResponse.redirect(new URL(`/${preferred}`, request.url));
  }

  // Lightweight gate for the admin area. This only checks cookie *presence*
  // (fast, edge-safe, no DB access) — the real session/expiry/role check
  // happens server-side in app/admin/(protected)/layout.tsx via
  // lib/auth/session.ts. This is defense in depth, not the source of truth.
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const hasSession = request.cookies.has(SESSION_COOKIE);
    if (!hasSession) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
