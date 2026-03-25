import type { Color, RectangleLayer } from "~/types";
import { memo } from "react";
import { colorObjToHex } from "~/lib/utils";

const getHexColor = (colorObj: Color) =>
  colorObj ? colorObjToHex(colorObj) : "#ccc";

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  onLayerPointerDown: (layerId: string, event: React.PointerEvent) => void;
}

const Rectangle = memo(({ id, layer, onLayerPointerDown }: RectangleProps) => {
  const { x, y, width, height, fill, stroke, opacity, cornerRadius } = layer;

  return (
    <g className="group">
      {/* Hover border */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
        stroke="#0b99ff"
        strokeWidth={4}
        className="pointer-events-none opacity-0 group-hover:opacity-100"
      />

      {/* Main rectangle */}
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
        onPointerDown={(event) => onLayerPointerDown(id, event)}
      />
    </g>
  );
});

Rectangle.displayName = "Rectangle";

export default Rectangle;
