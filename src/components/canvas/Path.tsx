import type { Color } from "~/types";
import { memo } from "react";
import { getStroke } from "perfect-freehand";
import { colorObjToHex, getSvgPathFromStroke } from "~/lib/utils";

const getHexColor = (colorObj: Color) =>
  colorObj ? colorObjToHex(colorObj) : "#ccc";

interface PathProps {
  x: number;
  y: number;
  fill: Color;
  stroke: Color;
  opacity: number; // 0-1
  // Tuple format [x, y, pressure] — relative to this layer's (x, y) origin.
  points: [number, number, number][];
  onPointerDown?: (event: React.PointerEvent) => void;
}

const Path = memo(
  ({ x, y, fill, stroke, opacity, points, onPointerDown }: PathProps) => {
    const outlinePolygon = getStroke(points, {
      size: 16, // base diameter of the stroke at full pressure
      thinning: 0.5, // how much pressure narrows/widens the stroke (0 = uniform)
      smoothing: 0.5, // edge softness of the stroke outline
      streamline: 0.5, // path smoothing — reduces jitter from fast pointer moves
    });
    const pathData = getSvgPathFromStroke(outlinePolygon);

    // `points` are stored relative to (x, y), so we must translate before drawing.
    // `fill` drives the visible ink color; stroke adds an optional outline.
    return (
      <g className="group">
        {/* Hover border */}
        <path
          d={pathData}
          style={{ transform: `translate(${x}px,${y}px)` }}
          fill="none"
          stroke="oklch(0.7214 0.1337 49.9802)"
          strokeWidth={4}
          strokeLinejoin="round"
          strokeLinecap="round"
          className="pointer-events-none opacity-0 group-hover:opacity-100"
        />

        {/* Main path */}
        <path
          d={pathData}
          style={{ transform: `translate(${x}px,${y}px)` }}
          fill={getHexColor(fill)}
          stroke={getHexColor(stroke)}
          strokeWidth={1}
          opacity={opacity}
          onPointerDown={onPointerDown}
        />
      </g>
    );
  },
);

Path.displayName = "Path";

export default Path;
