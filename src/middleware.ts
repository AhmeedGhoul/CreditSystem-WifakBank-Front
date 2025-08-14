import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/signin", "/register"];

const PROTECTED_ROUTES: { path: string; allowedRoles: string[] }[] = [
    { path: "/space/users", allowedRoles: ["Admin"] },
    { path: "/space/activities", allowedRoles: ["Admin", "Auditor"] },
    { path: "/space/blank", allowedRoles: ["Admin", "Auditor"] },
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (PUBLIC_ROUTES.some((publicPath) => pathname.startsWith(publicPath))) {
        return NextResponse.next();
    }

    const token = request.cookies.get("access_token")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        const userRoles = payload.roles as string[];

        const restrictedRoute = PROTECTED_ROUTES.find((route) =>
            pathname.startsWith(route.path)
        );

        if (restrictedRoute && !restrictedRoute.allowedRoles.some((role) => userRoles.includes(role))) {
            return NextResponse.rewrite(new URL("/404", request.url));
        }

        return NextResponse.next();
    } catch (err) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }
}

export const config = {
    matcher: ["/space/:path*"],
};
