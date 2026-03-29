import NextAuth from "next-auth";
import { middlewareConfig } from "./server/auth/middleware-config";

// Initialize a "lightweight" version of auth for the Edge
const { auth } = NextAuth(middlewareConfig);

export default auth((req) => {
  const isAuthenticated = Boolean(req.auth);

  if (!isAuthenticated) {
    const redirectToUrl = new URL("/sign-in", req.nextUrl.origin);
    return Response.redirect(redirectToUrl);
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
