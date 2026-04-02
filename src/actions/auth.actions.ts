"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { ZodError } from "zod";
import { signUpFormSchema } from "~/validations";
import { signIn, signOut } from "~/server/auth";
import { db } from "~/server/db";

export async function signInAction(
  _prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/dashboard",
    });
  } catch (error) {
    console.error("Error in sign in action:", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials";
        default:
          return "Oops! Something went wrong.";
      }
    }

    throw error;
  }
}

export async function signUpAction(
  _prevState: string | undefined,
  formData: FormData,
) {
  try {
    const { email, password } = await signUpFormSchema.parseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const user = await db.user.findUnique({ where: { email } });

    if (user) return "User already exists";

    const hash = await bcrypt.hash(password, 10);
    await db.user.create({
      data: { email, password: hash },
    });

    // Auto sign-in with the same plain-text password —
    // authorize() in config.ts will bcrypt.compare it normally
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    console.error("Error in sign up action:", error);

    if (error instanceof ZodError) {
      return error.errors.map((err) => err.message).join(", ");
    }

    if (error instanceof AuthError) {
      // User was created but session issuance failed — very rare
      return "Account created. Please sign in manually.";
    }

    // Re-throw everything else, importantly NEXT_REDIRECT which
    // signIn() throws internally on success — must not be swallowed
    throw error;
  }
}

export async function signOutAction() {
  try {
    // clear cookie only; client drives navigation (see UserMenu.tsx)
    await signOut({ redirect: false });
  } catch (error) {
    console.error("Error in sign out action:", error);
    return;
  }
}
