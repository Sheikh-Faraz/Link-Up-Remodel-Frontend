// middleware.ts
// import { clerkMiddleware } from '@clerk/nextjs/server';

// export default clerkMiddleware({
//   publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
//   secretKey: process.env.CLERK_SECRET_KEY,
//   // you can configure public (non-protected) routes if needed
//   // publicRoutes: ["/", "/sign-in", "/sign-up"],
// });

// export const config = {
//   matcher: ['/((?!_next|.*\\.(?:js|css|png|jpg|svg)).*)', '/api/(.*)', '/protected(.*)', '/test-page(.*)'], 
// };


// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Get token from cookies or headers (cookies if you switch later)
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  // Define auth-related routes
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/Sign-up");
  // const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

  // If user is not authenticated and trying to access protected page → redirect to login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If user is authenticated and tries to visit login/signup → redirect to home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/Home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except API and static assets
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
