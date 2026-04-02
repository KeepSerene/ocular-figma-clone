import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GithubIcon from "../icons/GitHubIcon";
import Image from "next/image";

interface HeroProps {
  isAuthenticated: boolean;
}

export default function Hero({ isAuthenticated }: HeroProps) {
  const ctaHref = isAuthenticated ? "/dashboard" : "/sign-up";
  const ctaLabel = isAuthenticated ? "Open Dashboard" : "Design for free";

  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0d0d0e]">
      {/* Warm amber glow — radiates from top center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 90% 60% at 50% -8%, oklch(0.6716 0.1368 48.5130 / 0.15) 0%, transparent 65%)",
        }}
      />

      {/* Subtle secondary glow — bottom right accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 40% at 85% 100%, oklch(0.5360 0.0398 196.0280 / 0.07) 0%, transparent 60%)",
        }}
      />

      {/* Dot grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.065) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pt-36 pb-24 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/4 px-4 py-1.5 text-[0.65rem] font-semibold tracking-[0.12em] text-white/40 uppercase backdrop-blur-sm">
          <span className="bg-primary size-1.5 animate-pulse rounded-full" />
          Real-time collaborative design
        </div>

        {/* Headline */}
        <h1 className="mb-5 text-4xl leading-[1.06] font-bold tracking-tight text-white sm:text-6xl lg:text-[4.75rem]">
          Design, <span className="bg-primary/20">in focus.</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-white/45 sm:text-lg sm:leading-relaxed">
          A high-performance SVG canvas built for speed and precision. Draw
          shapes, add text, sketch freehand — and watch your team build
          alongside you, live.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={ctaHref}
            className="bg-primary text-primary-foreground inline-flex h-11 items-center gap-2 rounded-[calc(var(--radius)-1px)] px-6 text-sm font-semibold transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
          >
            {ctaLabel}
            <ArrowRight className="size-4" />
          </Link>

          <a
            href="https://github.com/KeepSerene/ocular-figma-clone"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-[calc(var(--radius)-1px)] border border-white/12 bg-white/4 px-6 text-sm font-medium text-white/55 transition-all duration-150 hover:bg-white/8 hover:text-white/80 active:scale-[0.98]"
          >
            <GithubIcon className="size-4" />
            View on GitHub
          </a>
        </div>

        {/* Hero image / screenshot placeholder */}
        <div className="relative mt-20">
          {/* Subtle reflection underneath */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-4 -bottom-8 h-24 blur-2xl"
            style={{
              backgroundImage:
                "linear-gradient(to top, oklch(0.6716 0.1368 48.5130 / 0.06), transparent)",
            }}
          />

          <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-white/2.5 shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
            {/* Faux window chrome */}
            <div className="flex items-center gap-1.5 border-b border-white/5 bg-white/3 px-4 py-3">
              <span className="size-2.5 rounded-full bg-red-500" />
              <span className="size-2.5 rounded-full bg-yellow-500" />
              <span className="size-2.5 rounded-full bg-emerald-500" />
            </div>

            <Image
              src="/ocular-banner.webp"
              width={1200}
              height={634}
              alt="Banner image of the Ocular collaborative canvas workspace"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
