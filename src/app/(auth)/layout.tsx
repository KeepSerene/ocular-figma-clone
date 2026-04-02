import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import Logo from "~/components/Logo";
import Image from "next/image";

export const metadata: Metadata = {
  title: {
    template: "%s | Ocular",
    default: "Welcome | Ocular",
  },
};

async function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex min-h-dvh">
      {/* Left decorative panel */}
      <aside className="relative hidden flex-col overflow-hidden bg-[#0d0d0e] lg:flex lg:w-[46%] xl:w-[44%]">
        {/* Ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 30% 10%, oklch(0.6716 0.1368 48.5130 / 0.18) 0%, transparent 65%)",
          }}
        />

        {/* Teal counter-glow — bottom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 40% at 70% 95%, oklch(0.5360 0.0398 196.0280 / 0.09) 0%, transparent 60%)",
          }}
        />

        {/* Dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        {/* Top border accent */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            backgroundImage:
              "linear-gradient(to right, transparent, oklch(0.6716 0.1368 48.5130 / 0.4), transparent)",
          }}
        />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-between p-10">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Back to home"
            className="text-primary hover:text-primary/85 focus-visible:text-primary/85 shrink-0 transition-colors duration-150 focus-visible:outline-none"
          >
            <Logo size={36} />
          </Link>

          {/* Central branding block */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl leading-snug font-bold tracking-tight text-white">
                Design without
                <br />
                <span className="text-primary">limits.</span>
              </h2>

              <p className="max-w-xs text-sm leading-relaxed text-white/40">
                A precision SVG canvas, live collaboration, and a
                distraction-free environment — all in your browser.
              </p>
            </div>

            {/* Mini feature bullets */}
            <ul className="flex flex-col gap-2.5" role="list">
              {[
                "Real-time multiplayer canvas",
                "Shapes, text & freehand paths",
                "Live layer & property controls",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2.5 text-xs text-white/35"
                >
                  <span className="bg-primary size-1.5 shrink-0 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Image placeholder */}
          <div className="overflow-hidden rounded-xl border border-white/6 bg-white/2.5">
            <Image
              src="/ocular-auth-banner.jpg"
              width={1200}
              height={385}
              alt="Banner image of the Ocular collaborative canvas workspace"
            />
          </div>
        </div>
      </aside>

      {/* ── Right form panel ──────────────────────────────────────────── */}
      <main className="bg-background flex w-full flex-col lg:w-[54%] xl:w-[56%]">
        {/* Mobile-only top bar with logo */}
        <div className="border-border flex items-center justify-between border-b px-6 py-4 lg:hidden">
          <Link href="/" aria-label="Back to home">
            <Logo size={24} />
          </Link>
        </div>

        {/* Centered form area */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-sm">
            {/* AuthForm */}
            {children}
          </div>
        </div>

        {/* Footer link */}
        <div className="border-border border-t px-6 py-4 text-center">
          <p className="text-muted-foreground text-xs">
            By continuing, you agree to Ocular&apos;s terms and privacy policy.
          </p>
        </div>
      </main>
    </div>
  );
}

export default AuthLayout;
