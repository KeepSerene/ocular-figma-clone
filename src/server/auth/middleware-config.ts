/**
 * By not importing PrismaAdapter or bcrypt,
 * the middleware.ts bundle will likely drop from 1.03 MB to under 200 KB.
 * This is necessary because otherwise the deployment on Vercel fails with the following error:
 * Error: The Edge Function "src/middleware" size is 1.03 MB and your plan size limit is 1 MB.
 * Learn More: https://vercel.link/edge-function-size
 */

import { type NextAuthConfig } from "next-auth";

export const middlewareConfig = {
  // We leave providers empty because the middleware only needs to
  // READ the session cookie/JWT, not perform the actual login logic.
  providers: [],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Keep this callback so the middleware identifies the user correctly
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
} satisfies NextAuthConfig;
