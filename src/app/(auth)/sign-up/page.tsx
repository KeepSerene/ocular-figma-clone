import type { Metadata } from "next";
import { AuthForm } from "~/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Ocular account and start designing.",
};

function SignUpPage() {
  return <AuthForm mode="sign-up" />;
}

export default SignUpPage;
