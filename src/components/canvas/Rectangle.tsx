import type { Color, RectangleLayer } from "~/types";
import { memo } from "react";
import { colorObjToHex } from "~/lib/utils";

const getHexColor = (colorObj: Color) =>
  colorObj ? colorObjToHex(colorObj) : "#ccc";

const Rectangle = memo(
  ({ id, layer }: { id: string; layer: RectangleLayer }) => {
    const { x, y, width, height, fill, stroke, opacity, cornerRadius } = layer;

    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={getHexColor(fill)}
        strokeWidth={1}
        stroke={getHexColor(stroke)}
        opacity={opacity}
        rx={cornerRadius ?? 0}
        ry={cornerRadius ?? 0}
      />
    );
  },
);

Rectangle.displayName = "Rectangle";

export default Rectangle;
