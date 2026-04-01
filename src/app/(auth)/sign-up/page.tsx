import type { Metadata } from "next";
import { AuthForm } from "~/components/auth/AuthForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your Ocular account and start designing.",
};

const SignUpPage = () => <AuthForm mode="sign-up" />;

export default SignUpPage;
