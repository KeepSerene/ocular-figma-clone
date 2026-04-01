"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import Logo from "~/components/Logo";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// Catches all runtime JS errors in any route
export default function GlobalError({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    // Log to your error reporting service here (e.g. Sentry)
    console.error("[app/error]", error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-dvh flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="absolute top-6 left-7">
        <Link href="/" aria-label="Back to home">
          <Logo
            size={28}
            className="text-primary/60 hover:text-primary focus-visible:text-primary transition-colors duration-200 focus-visible:outline-none"
          />
        </Link>
      </div>

      <div className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
        {/* Icon */}
        <div className="relative flex items-center justify-center">
          <div
            aria-hidden="true"
            className="bg-destructive/15 absolute size-28 rounded-full blur-2xl"
          />

          <div className="border-border bg-muted relative flex size-20 items-center justify-center rounded-2xl border">
            <AlertTriangle className="text-muted-foreground size-9" />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <p
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: "var(--destructive)" }}
          >
            Error
          </p>

          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Something went wrong
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed">
            An unexpected error occurred. Try again or return home.
          </p>

          {/* Digest for support */}
          {error.digest && (
            <p className="text-muted-foreground/50 mt-1 font-mono text-[0.65rem]">
              ID: {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-outline btn-md flex-1"
          >
            Go back
          </button>

          <button
            type="button"
            onClick={reset}
            className="btn btn-primary btn-md flex-1"
          >
            Try again
          </button>
        </div>

        {/* Subtle home fallback */}
        <Link
          href="/"
          className="text-muted-foreground text-xs transition-colors duration-150 hover:underline hover:underline-offset-2"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}
