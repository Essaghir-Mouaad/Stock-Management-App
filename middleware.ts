import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

//   console.log("🔑 Middleware path:", path, " | Token:", token ? "YES" : "NO");

  // Protect admin and worker routes
  if (path.startsWith("/admin") || path.startsWith("/worker")) {
    if (!token) {
      console.log("🚫 No token → Redirecting to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/worker/:path*"],
};
