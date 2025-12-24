import { NextRequest, NextResponse } from "next/server";
import { IAdmin } from "./types/auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NEXT_LOCALE, TOKEN_COOKIE, ADMIN_COOKIE } from "./constants";

// Middleware function
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get(TOKEN_COOKIE)?.value;
  // const user = req.cookies.get(ADMIN_COOKIE)?.value;
  const locale = req.cookies.get(NEXT_LOCALE)?.value || "ar";

  // Ensure locale is either "ar" or "en"
  const validLocale = locale === "ar" || locale === "en" ? locale : "ar";

  const isLoginRoute = /^\/(en|ar)\/login$/.test(path);
  const isProtectedRoute = !isLoginRoute; // Protect all routes except login

  // const isAdmin = user ? (JSON.parse(user) as IAdmin).isAdmin : false;

  // If a protected route is accessed without a token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL(`/${validLocale}/login`, req.url));
  }

  // If there is a token and a user but the user is not an admin
  // if (isProtectedRoute && !!token && !!user && !isAdmin) {
  //   return NextResponse.redirect(new URL(`/${validLocale}/login`, req.url));
  // }

  // If a logged-in user tries to access the login page, redirect to home
  if (isLoginRoute && !!token) {
    return NextResponse.redirect(new URL(`/${validLocale}`, req.url));
  }

  // Default middleware behavior
  return createMiddleware(routing)(req);
}

// Apply middleware to all pages except API routes
export const config = {
  matcher: ["/", "/(en|ar)/:path*"],
};
