import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get auth data from cookies
    const accessToken = request.cookies.get("access_token")?.value;
    const userRole = request.cookies.get("user_role")?.value as "doctor" | "patient" | undefined;

    // Check if user is authenticated
    const isAuthenticated = !!accessToken;
  

    // Handle expired or invalid token case
    if (isAuthenticated) {
        try {
            const response = await fetch(`https://accexx-backend-gbn6c.ondigitalocean.app/api/auth/validate-token`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}` 
                },
                body: JSON.stringify({ token: accessToken })
            });

            if (!response.ok) {
                console.warn("Token is invalid or expired. Clearing session...");
                const res = NextResponse.redirect(new URL("/", request.url));
                res.cookies.delete("access_token");
                res.cookies.delete("user_role");
                return res;
            }
        } catch (error) {
            console.error("Error validating token:", error);
        }
    }

    // **Redirect authenticated users away from public routes (Login/Register)**
    if (isAuthenticated && (pathname.includes("/login") || pathname.includes("/register"))) {
        if (userRole === "doctor") {
            return NextResponse.redirect(new URL("/doctors/dashboard", request.url));
        } else if (userRole === "patient") {
            return NextResponse.redirect(new URL("/patients", request.url));
        }
    }

    // **Redirect authenticated users trying to access public pages**
    const publicRoutes = ["/", "/about", "/contact", "/faq", "/for-doctors", "/services"];
    if (isAuthenticated && publicRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL(userRole === "doctor" ? "/doctors/dashboard" : "/patients", request.url));
    }

    // **Doctor routes protection**
    if (pathname.startsWith("/doctors") && pathname !== "/login" && pathname !== "/doctors/register") {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        if (userRole !== "doctor") {
            return NextResponse.redirect(new URL("/patients", request.url));
        }
    }

    // **Patient routes protection**
    if (pathname.startsWith("/patients") && pathname !== "/login" && pathname !== "/register") {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        if (userRole !== "patient") {
            return NextResponse.redirect(new URL("/doctors/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

// **Apply middleware only to relevant paths**
export const config = {
    matcher: [
        "/doctors/:path*",
        "/patients/:path*",
        "/login",
        "/doctors/register",
        "/register",
        "/patients/login",
        "/patients/register",  // This is including your registration page!
        "/", "/about", "/contact", "/faq", "/for-doctors", "/services",
    ],
};
