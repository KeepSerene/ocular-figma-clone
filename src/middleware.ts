import { auth } from "./server/auth";

export default auth((req) => {
  const isAuthenticated = Boolean(req.auth);

  if (!isAuthenticated) {
    const redirectToUrl = new URL("/sign-in", req.nextUrl.origin);

    return Response.redirect(redirectToUrl);
  }
});

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
