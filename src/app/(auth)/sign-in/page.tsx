import type { Metadata } from "next";
import { AuthForm } from "~/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Ocular account and get back to building.",
};

function SignInPage() {
  return <AuthForm mode="sign-in" />;
}

export default SignInPage;
