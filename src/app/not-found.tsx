"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileSearch } from "lucide-react";
import Logo from "~/components/Logo";

// Catches all 404s
export default function NotFound() {
  const router = useRouter();

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

      <section className="flex w-full max-w-sm flex-col items-center gap-8 text-center">
        {/* Icon */}
        <div className="relative flex items-center justify-center">
          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="bg-primary/15 absolute size-28 rounded-full blur-2xl"
          />

          <div className="border-border bg-muted relative flex size-20 items-center justify-center rounded-2xl border">
            <FileSearch className="text-muted-foreground size-9" />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <p className="text-primary text-xs font-semibold tracking-widest uppercase">
            404
          </p>

          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Page not found
          </h1>

          <p className="text-muted-foreground text-sm leading-relaxed">
            This page doesn&apos;t exist or you don&apos;t have access to it.
          </p>
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

          <Link href="/" className="btn btn-primary btn-md flex-1">
            Go home
          </Link>
        </div>
      </section>
    </div>
  );
}
