// middleware.ts
// Protects dashboard routes from unauthenticated access
// Spec section 14: Authentication & Authorization Flow

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect these routes — user must be logged in
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/watchlist/:path*",
    "/alerts/:path*",
    "/market/:path*",
  ],
};
