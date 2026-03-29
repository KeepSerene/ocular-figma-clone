"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import UserAvatar from "../canvas/sidebars/UserAvatar";
import { ChevronDown, Loader2, LogOut } from "lucide-react";
import { signOutAction } from "~/actions/auth.actions";

function UserMenu({ email }: { email: string | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const menuParentRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Close user menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuParentRef.current &&
        !menuParentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOutAction(); // clears the JWT cookie server-side
    } catch {
      // swallow — we're navigating away regardless
    } finally {
      router.push("/sign-in");
    }
  };

  return (
    <div ref={menuParentRef} className="relative">
      {/* User menu trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-fit items-center gap-2 rounded-md p-1 transition-colors duration-200 hover:bg-gray-100 focus-visible:bg-gray-200 focus-visible:outline-none"
      >
        <UserAvatar isSelf={true} name={email ?? "Anonymous"} />

        <span
          aria-label={email ?? undefined}
          title={email ?? undefined}
          className="max-w-[20ch] truncate text-sm font-medium select-none"
        >
          {email}
        </span>

        <ChevronDown className="size-4" />
      </button>

      {/* User menu dropdown */}
      <div
        className={`absolute top-0 left-0 min-w-37.5 translate-y-full flex-col rounded-xl bg-[#f5f5f5] p-2 shadow-lg ${
          isOpen ? "flex" : "hidden"
        }`}
      >
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex w-full items-center gap-1 rounded-md p-1 text-gray-900 transition-colors duration-200 hover:bg-blue-500 hover:text-white focus-visible:bg-blue-500 focus-visible:text-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSigningOut ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span className="text-xs font-medium">Signing out...</span>
            </>
          ) : (
            <>
              <LogOut className="size-4" />
              <span className="text-xs font-medium">Sign out</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default UserMenu;
