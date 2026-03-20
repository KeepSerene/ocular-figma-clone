"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, LogIn, UserPlus2 } from "lucide-react";
import { signInAction, signUpAction } from "../actions/auth.actions";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

const config = {
  "sign-in": {
    title: "Log Into Your Account",
    action: signInAction,
    submitLabel: "Sign in",
    pendingLabel: "Logging in...",
    Icon: LogIn,
    footerText: "Don't have an account?",
    footerLinkLabel: "Sign up",
    footerLinkHref: "/sign-up",
  },
  "sign-up": {
    title: "Create Your Account",
    action: signUpAction,
    submitLabel: "Register",
    pendingLabel: "Signing up...",
    Icon: UserPlus2,
    footerText: "Already have an account?",
    footerLinkLabel: "Sign in",
    footerLinkHref: "/sign-in",
  },
} as const;

export function AuthForm({ mode }: AuthFormProps) {
  const {
    title,
    action,
    submitLabel,
    pendingLabel,
    Icon,
    footerText,
    footerLinkLabel,
    footerLinkHref,
  } = config[mode];

  const [errorMessage, formAction, isPending] = useActionState(
    action,
    undefined,
  );

  return (
    <article className="w-full max-w-sm space-y-6">
      <h1 className="text-center text-2xl font-semibold text-gray-900">
        {title}
      </h1>

      <form action={formAction} className="space-y-4">
        <div className="relative h-fit">
          <label htmlFor="email" className="absolute top-2 left-3 text-xs">
            EMAIL
          </label>

          <input
            id="email"
            type="email"
            name="email"
            required
            placeholder={
              mode === "sign-in" ? "Your registered email" : "your@email.com"
            }
            className="w-full rounded-md border border-gray-300 px-3 pt-7 pb-1 text-sm focus-within:border-black focus-within:outline-none"
          />
        </div>

        <div className="relative h-fit">
          <label htmlFor="password" className="absolute top-2 left-3 text-xs">
            PASSWORD
          </label>

          <input
            id="password"
            type="password"
            name="password"
            minLength={8}
            maxLength={32}
            required
            placeholder="●●●●●●●●"
            className="w-full rounded-md border border-gray-300 px-3 pt-7 pb-1 text-sm focus-within:border-black focus-within:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-black py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-gray-900 focus-visible:bg-gray-900 focus-visible:outline-none disabled:bg-gray-400"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {pendingLabel}
            </>
          ) : (
            <>
              <Icon className="size-4" />
              {submitLabel}
            </>
          )}
        </button>

        <p className="text-center text-xs text-shadow-gray-600">
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="font-medium text-blue-400 hover:text-blue-600 focus:outline-none focus-visible:text-blue-600"
          >
            {footerLinkLabel}
          </Link>
        </p>

        {errorMessage && (
          <p className="text-center text-sm leading-tight text-red-500">
            {errorMessage}
          </p>
        )}
      </form>
    </article>
  );
}
