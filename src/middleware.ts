import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ROLE_ROUTES: Record<string, string> = {
  ENTERPRISE: "/enterprise",
  MEMBER: "/member",
  ADMIN: "/admin",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/api/auth")
  ) {
    // Redirect logged-in users away from login page and "/" to their dashboard
    if (pathname === "/login" || pathname === "/") {
      const token = await getToken({ req, secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET });
      if (token?.role) {
        const role = token.role as string;
        return NextResponse.redirect(
          new URL(ROLE_ROUTES[role] || "/login", req.url)
        );
      }
    }
    return NextResponse.next();
  }

  // Protected routes - require auth
  const token = await getToken({ req, secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = token.role as string;

  // Role-based route protection
  const redirect = ROLE_ROUTES[role] || "/login";
  if (pathname.startsWith("/enterprise") && role !== "ENTERPRISE") {
    return NextResponse.redirect(new URL(redirect, req.url));
  }
  if (pathname.startsWith("/member") && role !== "MEMBER") {
    return NextResponse.redirect(new URL(redirect, req.url));
  }
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(redirect, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.webp$|.*\\.ico$).*)"],
};
