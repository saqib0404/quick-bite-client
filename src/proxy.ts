import { NextRequest, NextResponse } from "next/server";
import { Roles } from "./constants/roles";
import { userService } from "./services/user.service";

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const { data } = await userService.getSession();

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

    // 🟡 NOT LOGGED IN
    if (!data) {
        // Allow access to login/register
        if (isAuthPage) return NextResponse.next();

        // Block all dashboards
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = data.user.role;

    // 🟢 LOGGED IN but trying to visit login/register
    if (isAuthPage) {
        return NextResponse.redirect(new URL(getRedirectPath(role), request.url));
    }

    // 🔒 ADMIN ROUTE
    if (pathname.startsWith("/admin-dashboard") && role !== Roles.admin) {
        return NextResponse.redirect(new URL(getRedirectPath(role), request.url));
    }

    // 🔒 PROVIDER ROUTE
    if (pathname.startsWith("/provider-dashboard") && role !== Roles.provider) {
        return NextResponse.redirect(new URL(getRedirectPath(role), request.url));
    }

    // 🔒 CUSTOMER ROUTE
    if (pathname.startsWith("/dashboard") && role !== Roles.customer) {
        return NextResponse.redirect(new URL(getRedirectPath(role), request.url));
    }

    return NextResponse.next();
}

function getRedirectPath(role: string) {
    switch (role) {
        case Roles.admin:
            return "/admin-dashboard";
        case Roles.provider:
            return "/provider-dashboard";
        case Roles.customer:
        default:
            return "/dashboard";
    }
}

export const config = {
    matcher: [
        "/login",
        "/register",
        "/dashboard/:path*",
        "/admin-dashboard/:path*",
        "/provider-dashboard/:path*",
    ],
};
