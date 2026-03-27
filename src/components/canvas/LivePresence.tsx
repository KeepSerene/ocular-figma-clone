"use client";

import {
  shallow,
  useOthersConnectionIds,
  useOthersMapped,
} from "@liveblocks/react";
import Cursor from "./Cursor";
import { memo } from "react";
import Path from "./Path";
import type { Color } from "~/types";

// To see other users' cursors live
function Cursors() {
  const othersConnectionIds = useOthersConnectionIds();

  return (
    <>
      {othersConnectionIds.map((connectionId) => (
        <Cursor key={connectionId} connectionId={connectionId} />
      ))}
    </>
  );
}

const getRgbColorObj = (colorObj: Color | null) => {
  return colorObj ? colorObj : { r: 217, g: 217, b: 217 };
};

// To see live previews of what other users are drawing
function Drafts() {
  const othersDrafts = useOthersMapped(
    (other) => ({
      penColor: other.presence.penColor,
      pencilDraft: other.presence.pencilDraft,
    }),
    shallow,
  );

  return (
    <>
      {othersDrafts.map(([connectionId, draft]) => {
        if (!draft.pencilDraft || draft.pencilDraft.length < 2) return null;

        return (
          <Path
            key={connectionId}
            x={0}
            y={0}
            points={draft.pencilDraft}
            fill={getRgbColorObj(draft.penColor)}
            stroke={getRgbColorObj(draft.penColor)}
            opacity={1}
          />
        );
      })}
    </>
  );
}

const LivePresence = memo(() => (
  <>
    <Cursors />
    <Drafts />
  </>
));

LivePresence.displayName = "LivePresence";

export default LivePresence;
