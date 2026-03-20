import type { Color, Layer, Point } from "~/types";
import type { LiveList, LiveMap, LiveObject, Lson } from "@liveblocks/client";

// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data

// LiveLayer is still a Layer, but it also satisfies the index signature contract for Lson
export type LiveLayer = Layer & { [key: string]: Lson | undefined };

declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: {
      // Example, real-time cursor coordinates
      // cursor: { x: number; y: number };
      cursor: Point | null;
      selections: string[]; // the list of elements the user has selected (a list of layer IDs)
      penColor: Color | null;
      pencilDraft: [x: number, y: number, pressure: number][] | null; // helps showing real-time path traces (pressure is thickness of a path) to users
    };

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: {
      // Example, a conflict-free list
      // animals: LiveList<string>;
      canvasColor: Color | null; // canvas color of a room
      layers: LiveMap<string, LiveObject<LiveLayer>>; // string = layer ID
      layerIds: LiveList<string>; // helps sorting (ordering) the layers by their IDs
    };

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        // Example properties, for useSelf, useUser, useOthers, etc.
        // name: string;
        // avatar: string;
        name: string; // name of a liveblock authenticated user
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: {};
    // Example has two events, using a union
    // | { type: "PLAY" }
    // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: {
      // Example, attaching coordinates to a thread
      // x: number;
      // y: number;
    };

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: {
      // Example, rooms with a title and url
      // title: string;
      // url: string;
    };
  }
}

export {};
