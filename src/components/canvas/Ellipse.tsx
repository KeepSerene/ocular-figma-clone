import type { Color, EllipseLayer } from "~/types";
import { memo } from "react";
import { colorObjToHex } from "~/lib/utils";

const getHexColor = (colorObj: Color) =>
  colorObj ? colorObjToHex(colorObj) : "#ccc";

const Ellipse = memo(({ id, layer }: { id: string; layer: EllipseLayer }) => {
  const { x, y, width, height, fill, stroke, opacity } = layer;

  return (
    <ellipse
      style={{ transform: `translate(${x}px,${y}px)` }}
      rx={width / 2}
      ry={height / 2}
      cx={width / 2}
      cy={height / 2}
      fill={getHexColor(fill)}
      stroke={getHexColor(stroke)}
      opacity={opacity}
    />
  );
});

Ellipse.displayName = "Ellipse";

export default Ellipse;
