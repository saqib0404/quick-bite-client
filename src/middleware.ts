// import { NextRequest, NextResponse } from "next/server";
// import { Roles } from "./constants/roles";
// import { userService } from "./services/user.service";


// export async function proxy(request: NextRequest) {
//     const pathname = request.nextUrl.pathname;
//     const { data, error } = await userService.getSession();

//     const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
//     console.log(data, "data");
//     console.log(error);

//     //  NOT LOGGED IN
//     if (!data?.user) {
//         // Allow access to login/register
//         if (isAuthPage) return NextResponse.next();

//         // Block all dashboards
//         return NextResponse.redirect(new URL("/login", request.url));
//     }

//     const role = data.user.role;

//     //  LOGGED IN but trying to visit login/register
//     if (isAuthPage) {
//         return NextResponse.redirect(new URL(getRedirectPath(role), request.url));
//     }

//     //  ADMIN ROUTE
//     if (pathname.startsWith("/admin-dashboard") && role !== Roles.admin) {
//         return NextResponse.redirect(new URL(getRedirectPath(role), request.url));
//     }

//     //  PROVIDER ROUTE
//     if (pathname.startsWith("/provider-dashboard") && role !== Roles.provider) {
//         return NextResponse.redirect(new URL(getRedirectPath(role), request.url));
//     }

//     //  CUSTOMER ROUTE
//     if (pathname.startsWith("/dashboard") && role !== Roles.customer) {
//         return NextResponse.redirect(new URL(getRedirectPath(role), request.url));
//     }

//     return NextResponse.next();
// }

// function getRedirectPath(role: string) {
//     switch (role) {
//         case Roles.admin:
//             return "/admin-dashboard";
//         case Roles.provider:
//             return "/provider-dashboard/profile";
//         case Roles.customer:
//             return "/dashboard/profile";
//         default:
//             return "/dashboard/profile";
//     }
// }

// export const config = {
//     matcher: [
//         "/login",
//         "/register",
//         "/dashboard/:path*",
//         "/admin-dashboard/:path*",
import { NextRequest, NextResponse } from "next/server";
import { Roles } from "./constants/roles";
import { env } from "./env";

export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;

	// Skip middleware for some public routes
	if (pathname.startsWith("/verify-email") || pathname.startsWith("/api")) {
		return NextResponse.next();
	}

	const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

	// read cookies from the incoming request (middleware/edge-safe)
	const cookieHeader = request.headers.get("cookie") || "";

	// If no cookies present, allow auth pages; otherwise redirect to login
	if (!cookieHeader) {
		if (isAuthPage) return NextResponse.next();
		return NextResponse.redirect(new URL("/login", request.url));
	}

	try {
		const sessionUrl = new URL("/api/auth/get-session", request.url).toString();
		const res = await fetch(sessionUrl, {
			headers: {
				Cookie: cookieHeader,
			},
			cache: "no-store",
		});

		const session = await res.json();

		if (!session?.user) {
			if (isAuthPage) return NextResponse.next();
			return NextResponse.redirect(new URL("/login", request.url));
		}

		const role = session.user.role as string;

		// if logged in but trying to visit login/register -> redirect to dashboard
		if (isAuthPage) return NextResponse.redirect(new URL(getRedirectPath(role), request.url));

		// Role-based route guards
		if (pathname.startsWith("/admin-dashboard") && role !== Roles.admin) {
			return NextResponse.redirect(new URL(getRedirectPath(role), request.url));
		}

		if (pathname.startsWith("/provider-dashboard") && role !== Roles.provider) {
			return NextResponse.redirect(new URL(getRedirectPath(role), request.url));
		}

		if (pathname.startsWith("/dashboard") && role !== Roles.customer) {
			return NextResponse.redirect(new URL(getRedirectPath(role), request.url));
		}

		return NextResponse.next();
	} catch (err) {
		// If auth service unreachable, allow public pages and send to login for protected
		if (isAuthPage) return NextResponse.next();
		return NextResponse.redirect(new URL("/login", request.url));
	}
}

function getRedirectPath(role: string) {
	switch (role) {
		case Roles.admin:
			return "/admin-dashboard";
		case Roles.provider:
			return "/provider-dashboard/profile";
		case Roles.customer:
			return "/dashboard/profile";
		default:
			return "/dashboard/profile";
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

// export alias so Next.js recognizes this as middleware when placed in src/ or project root
export const middleware = proxy;


