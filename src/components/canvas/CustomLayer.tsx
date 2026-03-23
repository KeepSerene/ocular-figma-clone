import { useStorage } from "@liveblocks/react";
import { memo } from "react";
import { LayerType } from "~/types";
import Rectangle from "./Rectangle";
import Ellipse from "./Ellipse";
import Path from "./Path";
import Text from "./Text";

const CustomLayer = memo(({ id }: { id: string }) => {
  const layer = useStorage((root) => root.layers.get(id));

  if (!layer) {
    return null;
  }

  switch (layer.type) {
    case LayerType.RECTANGLE:
      return <Rectangle id={id} layer={layer} />;
    case LayerType.ELLIPSE:
      return <Ellipse id={id} layer={layer} />;
    case LayerType.PATH:
      return (
        <Path
          id={id}
          x={layer.x}
          y={layer.y}
          points={layer.points}
          fill={layer.fill}
          stroke={layer.stroke}
          opacity={layer.opacity}
        />
      );
    case LayerType.TEXT:
      return <Text id={id} layer={layer} />;
    default:
      return null;
  }
});

CustomLayer.displayName = "CustomLayer";

export default CustomLayer;
