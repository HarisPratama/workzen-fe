import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("access_token");
    const refreshToken = request.cookies.get("refresh_token");
    const { pathname } = request.nextUrl;

    // Protected routes: redirect to login if no tokens
    if (pathname.startsWith("/org")) {
        if (!token && !refreshToken) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Already logged in: redirect away from auth pages
    if (pathname === "/login" || pathname === "/register") {
        if (token || refreshToken) {
            return NextResponse.redirect(new URL("/org/overview", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/org/:path*", "/login", "/register"],
};
