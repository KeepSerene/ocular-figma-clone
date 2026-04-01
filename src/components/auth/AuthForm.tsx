"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2, LogIn, UserPlus2, AlertCircle } from "lucide-react";
import { signInAction, signUpAction } from "../../actions/auth.actions";
import PasswordInput from "./PasswordInput";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

const config = {
  "sign-in": {
    heading: "Welcome back",
    subheading: "Sign in to continue to your workspace.",
    action: signInAction,
    submitLabel: "Sign in",
    pendingLabel: "Signing in…",
    Icon: LogIn,
    footerText: "No account yet?",
    footerLinkLabel: "Create one",
    footerLinkHref: "/sign-up",
  },
  "sign-up": {
    heading: "Create your account",
    subheading: "Start designing in seconds — no credit card required.",
    action: signUpAction,
    submitLabel: "Create account",
    pendingLabel: "Creating account…",
    Icon: UserPlus2,
    footerText: "Already have an account?",
    footerLinkLabel: "Sign in",
    footerLinkHref: "/sign-in",
  },
} as const;

export function AuthForm({ mode }: AuthFormProps) {
  const {
    heading,
    subheading,
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
    <article className="w-full space-y-7">
      {/* Heading block */}
      <div className="space-y-1.5">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">
          {heading}
        </h1>

        <p className="text-muted-foreground text-sm">{subheading}</p>
      </div>

      {/* Form */}
      <form action={formAction} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-foreground/70 block text-xs font-medium tracking-wide uppercase"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder={
              mode === "sign-in" ? "your@email.com" : "your@email.com"
            }
            className="border-input bg-background text-foreground placeholder:text-muted-foreground/50 focus:border-ring w-full rounded-md border px-3.5 py-2.5 text-sm transition-colors duration-150 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-foreground/70 block text-xs font-medium tracking-wide uppercase"
          >
            Password
          </label>

          <PasswordInput
            id="password"
            name="password"
            minLength={8}
            maxLength={32}
            required
            autoComplete={
              mode === "sign-in" ? "current-password" : "new-password"
            }
            placeholder="●●●●●●●●"
          />

          {mode === "sign-up" && (
            <p className="text-muted-foreground/60 text-[0.7rem]">
              Must be 8-32 characters.
            </p>
          )}
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="border-destructive/25 bg-destructive/6 flex items-start gap-2.5 rounded-md border px-3.5 py-3">
            <AlertCircle className="text-destructive mt-0.5 size-4 shrink-0" />
            <p className="text-destructive text-sm leading-snug">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary btn-lg w-full"
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

        {/* Footer link */}
        <p className="text-muted-foreground text-center text-sm">
          {footerText}{" "}
          <Link
            href={footerLinkHref}
            className="font-medium transition-colors duration-150 hover:underline hover:underline-offset-2"
            style={{ color: "var(--primary)" }}
          >
            {footerLinkLabel}
          </Link>
        </p>
      </form>
    </article>
  );
}
