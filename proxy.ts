import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("access_token");
    const refreshToken = request.cookies.get("refresh_token");

    if (!refreshToken && !token && request.nextUrl.pathname.startsWith("/org")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (refreshToken && token && request.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/org", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/org/:path*", "/login"],
};
