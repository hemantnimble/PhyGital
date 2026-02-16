import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

// Routes that require login
const protectedRoutes = [
  "/user/account",
  "/user/checkoutone", 
  "/user/checkout"
];

// Routes only for ADMIN role
const adminRoutes = ["/admin"];

// Routes only for BRAND role
const brandRoutes = [
  "/brand/products",
  "/brand/settings",
  "/brand/dashboard"
];

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const userRole = session?.user?.role || [];

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isBrandRoute = brandRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // No session - redirect to home
  if (!session) {
    if (isProtected || isAdminRoute || isBrandRoute) {
      const absoluteURL = new URL("/", request.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }
  } 
  // Has session - check role permissions
  else {
    // Admin route check
    if (isAdminRoute && !userRole.includes("ADMIN")) {
      const absoluteURL = new URL("/", request.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }

    // Brand route check
    if (isBrandRoute && !userRole.includes("BRAND")) {
      const absoluteURL = new URL("/", request.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|verify).*)"
    //                                                ^^^^^^
    // IMPORTANT: /verify/* must be PUBLIC (no auth needed)
  ],
};