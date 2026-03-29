"use client";

import { LiveList, LiveMap, type LiveObject } from "@liveblocks/client";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react";
import type { LiveLayer } from "liveblocks.config";
import Logo from "../Logo";

function Room({
  children,
  roomId,
}: {
  children: React.ReactNode;
  roomId: string;
}) {
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
          canvasColor: { r: 30, g: 30, b: 30 },
          layers: new LiveMap<string, LiveObject<LiveLayer>>(),
          layerIds: new LiveList([]),
        }}
      >
        <ClientSideSuspense
          fallback={
            <div className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-white">
              <Logo size={50} className="animate-bounce" />

              <p className="text-sm italic md:text-base">
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
