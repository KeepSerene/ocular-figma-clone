import type { Color, EllipseLayer } from "~/types";
import { memo } from "react";
import { colorObjToHex } from "~/lib/utils";

const getHexColor = (colorObj: Color) =>
  colorObj ? colorObjToHex(colorObj) : "#ccc";

interface EllipseProps {
  id: string;
  layer: EllipseLayer;
  onLayerPointerDown: (layerId: string, event: React.PointerEvent) => void;
}

const Ellipse = memo(({ id, layer, onLayerPointerDown }: EllipseProps) => {
  const { x, y, width, height, fill, stroke, opacity } = layer;

  return (
    <g className="group">
      {/* Hover border */}
      <ellipse
        style={{ transform: `translate(${x}px,${y}px)` }}
        rx={width / 2}
        ry={height / 2}
        cx={width / 2}
        cy={height / 2}
        fill="none"
        stroke="#0b99ff"
        strokeWidth={4}
        className="pointer-events-none opacity-0 group-hover:opacity-100"
      />

      {/* Main ellipse */}
      <ellipse
        style={{ transform: `translate(${x}px,${y}px)` }}
        rx={width / 2}
        ry={height / 2}
        cx={width / 2}
        cy={height / 2}
        fill={getHexColor(fill)}
        stroke={getHexColor(stroke)}
        opacity={opacity}
        onPointerDown={(event) => onLayerPointerDown(id, event)}
      />
    </g>
  );
});

Ellipse.displayName = "Ellipse";

export default Ellipse;
