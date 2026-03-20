import { colorObjToHex } from "~/lib/utils";
import type { RectangleLayer } from "~/types";

function Rectangle({ id, layer }: { id: string; layer: RectangleLayer }) {
  const { x, y, width, height, fill, stroke, opacity, cornerRadius } = layer;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill ? colorObjToHex(fill) : "#ccc"}
        strokeWidth={1}
        stroke={stroke ? colorObjToHex(stroke) : "#ccc"}
        opacity={opacity}
        rx={cornerRadius ?? 0}
        ry={cornerRadius ?? 0}
      />
    </g>
  );
}

export default Rectangle;
