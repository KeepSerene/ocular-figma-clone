import { useOther } from "@liveblocks/react";
import { memo } from "react";
import { connectionIdToColor } from "~/lib/utils";

const Cursor = memo(({ connectionId }: { connectionId: number }) => {
  const cursor = useOther(connectionId, (user) => user.presence.cursor);
  const info = useOther(connectionId, (user) => user.info);

  if (!cursor) return null;

  const { x, y } = cursor;
  const color = connectionIdToColor(connectionId);
  const name = info?.name || "Anonymous";
  const initial = name.charAt(0).toUpperCase();

  return (
    <g
      style={{
        transform: `translate(${x}px,${y}px)`,
      }}
      pointerEvents="none"
    >
      {/* The cursor pointer */}
      <path
        d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
        fill={color}
      />

      {/* The avatar circle */}
      <circle cx="26" cy="26" r="10" fill={color} />

      {/* The avatar initial */}
      <text
        x="26"
        y="26"
        fill="white"
        fontSize="10"
        fontWeight="bold"
        fontFamily="var(--font-sans), Open Sans, sans-serif"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {initial}
      </text>
    </g>
  );
});

Cursor.displayName = "Cursor";

export default Cursor;
