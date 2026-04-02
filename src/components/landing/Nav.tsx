"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "~/components/Logo";
import { Menu, X, Loader2 } from "lucide-react";
import { signOutAction } from "~/actions/auth.actions";

interface NavProps {
  isAuthenticated: boolean;
}

export default function Nav({ isAuthenticated }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);

    try {
      await signOutAction();
      router.refresh();
    } catch (error) {
      console.error("Sign-out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/6 bg-[#0d0d0e]/90 shadow-lg backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          aria-label="Ocular — go to home"
          className="text-primary hover:text-primary/85 focus-visible:text-primary/85 shrink-0 transition-colors duration-150 focus-visible:outline-none"
        >
          <Logo size={26} />
        </Link>

        {/* Desktop nav links */}
        <ul role="list" className="hidden items-center gap-8 md:flex">
          <li>
            <a
              href="#features"
              className="text-sm text-white/55 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
            >
              Features
            </a>
          </li>

          <li>
            <a
              href="#how-it-works"
              className="text-sm text-white/55 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
            >
              How it works
            </a>
          </li>
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2.5 md:flex">
          {isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-white/14 bg-transparent px-4 text-sm font-medium text-white/70 transition-all hover:bg-white/7 hover:text-white focus-visible:bg-white/7 focus-visible:text-white focus-visible:outline-none active:scale-[0.98] disabled:opacity-50"
              >
                {isSigningOut ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Signing out...</span>
                  </>
                ) : (
                  "Sign out"
                )}
              </button>

              <Link
                href="/dashboard"
                className="bg-primary text-primary-foreground inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium transition-all hover:opacity-90 focus-visible:opacity-90 focus-visible:outline-none active:scale-[0.98]"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="inline-flex h-9 items-center rounded-md border border-white/[0.14] bg-transparent px-4 text-sm font-medium text-white/70 transition-all hover:bg-white/7 hover:text-white focus-visible:bg-white/7 focus-visible:text-white focus-visible:outline-none active:scale-[0.98]"
              >
                Sign in
              </Link>

              <Link
                href="/sign-up"
                className="bg-primary text-primary-foreground inline-flex h-9 items-center gap-2 rounded-md px-4 text-sm font-medium transition-all hover:opacity-90 focus-visible:opacity-90 focus-visible:outline-none active:scale-[0.98]"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close mobile menu" : "Open mobile menu"}
          title={mobileOpen ? "Close" : "Open"}
          className="flex size-9 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/7 hover:text-white focus-visible:bg-white/7 focus-visible:text-white focus-visible:outline-none md:hidden"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/6 bg-[#0d0d0e]/95 px-6 py-5 md:hidden">
          <ul className="flex flex-col gap-1" role="list">
            <li>
              <a
                href="#features"
                onClick={closeMenu}
                className="block rounded-md px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white focus-visible:bg-white/5 focus-visible:text-white focus-visible:outline-none"
              >
                Features
              </a>
            </li>

            <li>
              <a
                href="#how-it-works"
                onClick={closeMenu}
                className="block rounded-md px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white focus-visible:bg-white/5 focus-visible:text-white focus-visible:outline-none"
              >
                How it works
              </a>
            </li>
          </ul>

          <div className="mt-4 flex flex-col gap-2 border-t border-white/6 pt-4">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={async () => {
                    await handleSignOut();
                    closeMenu();
                  }}
                  disabled={isSigningOut}
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-white/14 text-sm font-medium text-white/70 transition-all hover:bg-white/7 hover:text-white focus-visible:bg-white/7 focus-visible:text-white focus-visible:outline-none disabled:opacity-50"
                >
                  {isSigningOut ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Signing out...</span>
                    </>
                  ) : (
                    "Sign out"
                  )}
                </button>

                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="bg-primary text-primary-foreground inline-flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-all hover:opacity-90 focus-visible:opacity-90 focus-visible:outline-none"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  onClick={closeMenu}
                  className="inline-flex h-10 w-full items-center justify-center rounded-md border border-white/14 text-sm font-medium text-white/70 transition-all hover:bg-white/7 hover:text-white focus-visible:bg-white/7 focus-visible:text-white focus-visible:outline-none"
                >
                  Sign in
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenu}
                  className="bg-primary text-primary-foreground inline-flex h-10 w-full items-center justify-center rounded-md text-sm font-medium transition-all hover:opacity-90 focus-visible:opacity-90 focus-visible:outline-none"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
