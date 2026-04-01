"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Keyboard,
  MousePointer2,
  Trash2,
  Undo2,
  Redo2,
  Maximize2,
  FolderOpen,
  Menu,
} from "lucide-react";
import Logo from "~/components/Logo";
import UserMenu from "~/components/dashboard/UserMenu";

// ─── Keyboard shortcut & mouse control definitions ────────────────────────────────────────────
interface Shortcut {
  description: string;
  keys: string[];
  icon: React.ReactNode;
}

interface ShortcutGroup {
  label: string;
  shortcuts: Shortcut[];
}

const iconSize = "size-3.5";

const shortcutGroups: ShortcutGroup[] = [
  {
    label: "Dashboard",
    shortcuts: [
      {
        description: "Open design",
        keys: ["⏎ / Double-click"],
        icon: <FolderOpen className={iconSize} />,
      },
      {
        description: "Delete design",
        keys: ["Backspace"],
        icon: <Trash2 className={iconSize} />,
      },
    ],
  },
  {
    label: "Canvas",
    shortcuts: [
      {
        description: "Select / Move",
        keys: ["Click"],
        icon: <MousePointer2 className={iconSize} />,
      },
      {
        description: "Context menu",
        keys: ["Right-click"],
        icon: <Menu className={iconSize} />,
      },
      {
        description: "Select all layers",
        keys: ["⌘", "A"],
        icon: <Maximize2 className={iconSize} />,
      },
      {
        description: "Delete layer(s)",
        keys: ["Backspace"],
        icon: <Trash2 className={iconSize} />,
      },
      {
        description: "Undo",
        keys: ["⌘", "Z"],
        icon: <Undo2 className={iconSize} />,
      },
      {
        description: "Redo",
        keys: ["⌘", "⇧", "Z"],
        icon: <Redo2 className={iconSize} />,
      },
    ],
  },
];

// ─── Kbd element ─────────────────────────────────────────────────────────────
const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="border-border bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded border px-1.5 font-mono text-[10px] leading-none">
    {children}
  </kbd>
);

// ─── Main component ───────────────────────────────────────────────────────────
interface SidebarProps {
  email: string | null;
}

export default function Sidebar({ email }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Collapse by default on small screens
  useEffect(() => {
    setMounted(true);

    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  }, [setMounted, setCollapsed]);

  return (
    <>
      {/* Spacer: Pushes the main dashboard content to the right on mobile so it isn't hidden behind the fixed sidebar */}
      <div className="w-14 shrink-0 md:hidden" aria-hidden="true" />

      {/* Backdrop on mobile */}
      {mounted && !collapsed && (
        <div
          className="bg-background/80 fixed inset-0 z-30 backdrop-blur-sm md:hidden"
          onClick={() => setCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`border-border bg-sidebar fixed top-0 left-0 z-40 flex h-dvh shrink-0 flex-col border-r transition-all duration-200 ease-in-out md:static ${
          collapsed ? "w-14" : "w-[85vw] max-w-64 md:w-64"
        } `}
      >
        {/* ── Header ── */}
        <div
          className={`border-border flex min-h-12 shrink-0 items-center border-b ${
            collapsed ? "justify-center px-0" : "justify-between px-4"
          }`}
        >
          {!collapsed && (
            <Link
              href="/"
              aria-label="Go to home"
              className="text-primary hover:text-primary/85 focus-visible:text-primary/85 shrink-0 transition-colors duration-150 focus-visible:outline-none"
            >
              <Logo size={26} showText={false} />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand" : "Collapse"}
            className="btn btn-icon btn-ghost text-muted-foreground size-7 p-1"
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4 shrink-0" />
            ) : (
              <PanelLeftClose className="size-4 shrink-0" />
            )}
          </button>
        </div>

        {/* ── User menu ── */}
        <div
          className={`border-border shrink-0 border-b ${collapsed ? "flex justify-center py-3" : "p-3"}`}
        >
          <UserMenu email={email} collapsed={collapsed} />
        </div>

        {/* ── Shortcuts section ── */}
        {!collapsed && (
          <div className="flex flex-1 flex-col gap-0 overflow-y-auto">
            {/* Section header */}
            <div className="flex items-center gap-2 px-4 pt-5 pb-3">
              <Keyboard className="text-muted-foreground size-3.5" />
              <span className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                Shortcuts & Controls
              </span>
            </div>

            {/* Groups */}
            <ul className="flex flex-col gap-5 px-3 pb-6">
              {shortcutGroups.map((group) => (
                <li key={group.label} className="flex flex-col gap-1">
                  {/* Group label */}
                  <p className="text-foreground/50 px-1 pb-1 text-[11px] font-medium">
                    {group.label}
                  </p>

                  {/* Shortcut rows */}
                  {group.shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.description}
                      className="hover:bg-accent/50 flex items-center justify-between gap-2 rounded-md px-2 py-2 transition-colors md:py-1.5"
                    >
                      <div className="text-muted-foreground flex items-center gap-2">
                        {shortcut.icon}
                        <span className="text-foreground/70 text-[13px] md:text-xs">
                          {shortcut.description}
                        </span>
                      </div>

                      <div className="flex shrink-0 items-center gap-0.5">
                        {shortcut.keys.map((key) => (
                          <Kbd key={key}>{key}</Kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Collapsed: shortcuts icon hint ── */}
        {collapsed && (
          <div
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts"
            className="flex flex-1 items-start justify-center pt-4"
          >
            <Keyboard className="text-muted-foreground/40 size-4" />
          </div>
        )}
      </aside>
    </>
  );
}
