import type { Color } from "~/types";
import { memo } from "react";
import { getStroke } from "perfect-freehand";
import { colorObjToHex, getSvgPathFromStroke } from "~/lib/utils";

const getHexColor = (colorObj: Color) =>
  colorObj ? colorObjToHex(colorObj) : "#ccc";

interface PathProps {
  id?: string;
  x: number;
  y: number;
  fill: Color;
  stroke: Color;
  opacity: number; // 0-1
  // Tuple format [x, y, pressure] — relative to this layer's (x, y) origin.
  points: [number, number, number][];
}

const Path = memo(({ id, x, y, fill, stroke, opacity, points }: PathProps) => {
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
    <path
      d={pathData}
      style={{ transform: `translate(${x}px,${y}px)` }}
      fill={getHexColor(fill)}
      stroke={getHexColor(stroke)}
      strokeWidth={1}
      opacity={opacity}
    />
  );
});

Path.displayName = "Path";

export default Path;
