import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInFormSchema } from "~/schemas";
import { db } from "~/server/db";

/**
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    /**
     * @see https://next-auth.js.org/providers/github
     */
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          // Get sign-in credentials from the sign-in form
          const { email, password } =
            await signInFormSchema.parseAsync(credentials);

          // Find user in db with the help of their email
          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user) return null;

          // Compare the entered password with the user's hashed password
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) return null;

          // All set, return the logged-in user
          return user;
        } catch (error) {
          console.log("Failed to authorize user:", error);

          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(db),
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
      },
    }),
  },
} satisfies NextAuthConfig;
