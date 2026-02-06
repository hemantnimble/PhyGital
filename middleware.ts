import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = [
  "/user/account",
  "/user/checkoutone",
  "/user/checkout",
];

const adminRoutes = ["/admin"];

export function middleware(request: NextRequest) {
  // NextAuth session cookie (works for both dev & prod)
  const sessionToken =
    request.cookies.get("next-auth.session-token") ||
    request.cookies.get("__Secure-next-auth.session-token");

  const pathname = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // ❌ Not logged in
  if (!sessionToken && (isProtected || isAdminRoute)) {
    return NextResponse.redirect(
      new URL("/user/signin", request.url)
    );
  }

  // ✅ Logged in but admin route
  // ⚠ You CANNOT check roles in middleware
  // That must be done in server components or APIs

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
