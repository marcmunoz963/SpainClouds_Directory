import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const authCookie = request.cookies.get("spainclouds_admin_auth")?.value;

    if (authCookie !== "1") {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};