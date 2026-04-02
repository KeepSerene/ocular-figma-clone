"use client";

import { useEffect, useState } from "react";
import { LiveList, LiveMap, type LiveObject } from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react";
import type { LiveLayer } from "liveblocks.config";
import Logo from "../Logo";
import { Copy, Check, MonitorX } from "lucide-react";

function Room({
  children,
  roomId,
}: {
  children: React.ReactNode;
  roomId: string;
}) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  const [hasCopied, setHasCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyError(null);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy URL:", error);
      setCopyError(
        "Couldn't copy automatically. Please copy the URL from the address bar.",
      );
    }
  };

  // Loading State (prevents hydration mismatch between Server and Client)
  if (isDesktop === null) {
    return (
      <div className="bg-background flex min-h-dvh flex-col items-center justify-center gap-2">
        <Logo size={50} className="text-primary animate-bounce" />

        <p className="text-muted-foreground text-sm italic md:text-base">
          Stretching the canvas...
        </p>
      </div>
    );
  }

  // Mobile/Tablet Fallback
  if (!isDesktop) {
    return (
      <div className="bg-background flex min-h-dvh flex-col items-center justify-center p-6 text-center">
        <div className="border-border bg-card flex w-full max-w-md flex-col items-center gap-6 rounded-2xl border p-8 shadow-2xl">
          <div className="bg-primary/10 text-primary flex size-16 shrink-0 items-center justify-center rounded-full">
            <MonitorX aria-hidden="true" className="size-8" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-foreground text-xl font-semibold tracking-tight">
              Desktop Recommended
            </h2>

            <p className="text-muted-foreground text-sm leading-relaxed">
              For the best experience, please open this design workspace on a
              desktop browser. The canvas and editing tools require a larger
              screen.
            </p>
          </div>

          <button
            type="button"
            onClick={copyUrlToClipboard}
            className="btn btn-primary btn-md w-full"
          >
            {hasCopied ? (
              <>
                <Check className="size-4" />
                Link Copied!
              </>
            ) : (
              <>
                <Copy className="size-4" />
                Copy page URL
              </>
            )}
          </button>

          {copyError && (
            <p className="text-destructive -mt-2 text-sm">{copyError}</p>
          )}
        </div>
      </div>
    );
  }

  // Desktop View (Initialize Liveblocks and Canvas)
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomId}
        initialPresence={{
          cursor: null,
          selections: [],
          penColor: null,
          pencilDraft: null,
        }}
        initialStorage={{
          canvasColor: { r: 26, g: 26, b: 30 },
          layers: new LiveMap<string, LiveObject<LiveLayer>>(),
          layerIds: new LiveList([]),
        }}
      >
        <ClientSideSuspense
          fallback={
            <div className="bg-background flex min-h-dvh flex-col items-center justify-center gap-2">
              <Logo size={50} className="text-primary animate-bounce" />

              <p className="text-muted-foreground text-sm italic md:text-base">
                Stretching the canvas...
              </p>
            </div>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}

export default Room;
