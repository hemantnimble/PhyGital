import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

const protectedRoutes = ["/user/account","/user/checkoutone","/user/checkout"];
const adminRoutes = ["/admin"];

export default async function middleware(request: NextRequest) {
  const session = await auth();
  const userRole = session?.user?.role || [];

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!session) {
    if (isProtected || isAdminRoute) {
      const absoluteURL = new URL("/", request.nextUrl.origin);
      return NextResponse.redirect(absoluteURL.toString());
    }
  } else if (isAdminRoute && !userRole.includes("ADMIN")) {
    const absoluteURL = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};