"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, LogOut } from "lucide-react";
import { signOutAction } from "~/actions/auth.actions";
import UserAvatar from "~/components/canvas/sidebars/UserAvatar";

interface UserMenuProps {
  email: string | null;
  collapsed?: boolean;
}

function UserMenu({ email, collapsed = false }: UserMenuProps) {
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
      await signOutAction();
    } catch {
      /* swallow — navigating away regardless */
    } finally {
      router.push("/sign-in");
    }
  };

  return (
    <div ref={menuParentRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={collapsed ? (email ?? "User menu") : undefined}
        title={collapsed ? (email ?? "User menu") : undefined}
        className={`hover:bg-accent focus-visible:bg-accent flex items-center gap-2.5 rounded-md text-left text-sm transition-colors duration-150 focus-visible:outline-none ${collapsed ? "mx-auto w-fit justify-center p-1.5" : "w-full p-2"} `}
      >
        <UserAvatar
          isSelf
          name={email ?? "Anonymous"}
          className="size-7 shrink-0"
        />

        {!collapsed && (
          <>
            <span
              title={email ?? undefined}
              className="text-foreground min-w-0 flex-1 truncate text-xs font-medium"
            >
              {email}
            </span>

            <ChevronDown
              className={`text-muted-foreground size-3.5 shrink-0 transition-transform duration-150 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`border-border bg-muted absolute z-50 min-w-44 overflow-hidden rounded-xl border shadow-lg ${collapsed ? "top-0 left-full ml-2" : "top-full left-0 mb-1.5 w-full"} `}
        >
          {/* Email header when not collapsed */}
          {!collapsed && email && (
            <div className="border-muted-foreground/20 border-b px-3 py-2.5">
              <p className="text-muted-foreground truncate text-[11px]">
                Signed in as
              </p>

              <p
                title={email}
                className="text-foreground mt-0.5 max-w-full truncate text-xs font-medium"
              >
                {email}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="p-1">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="text-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:bg-destructive/10 focus-visible:text-destructive flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSigningOut ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Signing out…</span>
                </>
              ) : (
                <>
                  <LogOut className="size-3.5" />
                  <span>Sign out</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
