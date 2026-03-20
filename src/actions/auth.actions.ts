"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { signUpFormSchema } from "~/schemas";
import { signIn, signOut } from "~/server/auth";
import { db } from "~/server/db";

export async function signInAction(
  prevState: string | undefined,
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

    // Re-throw anything that isn't an actual AuthError
    // so Next.js can handle it
    throw error;
  }
}

export async function signUpAction(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const { email, password } = await signUpFormSchema.parseAsync({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    const user = await db.user.findUnique({
      where: { email },
    });

    if (user) {
      return "User already exists";
    }

    const hash = await bcrypt.hash(password, 10);
    await db.user.create({
      data: {
        email,
        password: hash,
      },
    });
  } catch (error) {
    console.error("Error in sign up action:", error);

    if (error instanceof ZodError) {
      return error.errors.map((err) => err.message).join(", ");
    }

    return "An unexpected error occurred";
  }

  redirect("/sign-in");
}

export async function signOutAction() {
  try {
    await signOut();
  } catch (error) {
    console.error("Error in sign out action:", error);
  }
}
