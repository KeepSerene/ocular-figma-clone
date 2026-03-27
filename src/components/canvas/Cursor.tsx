import { useOther } from "@liveblocks/react";
import { memo } from "react";
import { connectionIdToColor } from "~/lib/utils";

const Cursor = memo(({ connectionId }: { connectionId: number }) => {
  const cursor = useOther(connectionId, (user) => user.presence.cursor);

  if (!cursor) return null;

  const { x, y } = cursor;

  return (
    <path
      d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
      style={{
        transform: `translate(${x}px,${y}px)`,
      }}
      fill={connectionIdToColor(connectionId)}
    />
  );
});

Cursor.displayName = "Cursor";

export default Cursor;
