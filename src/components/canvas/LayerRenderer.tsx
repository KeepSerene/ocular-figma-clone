import { useStorage } from "@liveblocks/react";
import { memo } from "react";
import { LayerType } from "~/types";
import Rectangle from "./Rectangle";
import Ellipse from "./Ellipse";
import Path from "./Path";
import Text from "./Text";

interface LayerRendererProps {
  id: string;
  onLayerPointerDown: (layerId: string, event: React.PointerEvent) => void;
}

const LayerRenderer = memo(({ id, onLayerPointerDown }: LayerRendererProps) => {
  const layer = useStorage((root) => root.layers.get(id));

  if (!layer) {
    return null;
  }

  switch (layer.type) {
    case LayerType.RECTANGLE:
      return (
        <Rectangle
          id={id}
          layer={layer}
          onLayerPointerDown={onLayerPointerDown}
        />
      );
    case LayerType.ELLIPSE:
      return (
        <Ellipse
          id={id}
          layer={layer}
          onLayerPointerDown={onLayerPointerDown}
        />
      );
    case LayerType.PATH:
      return (
        <Path
          x={layer.x}
          y={layer.y}
          points={layer.points}
          fill={layer.fill}
          stroke={layer.stroke}
          opacity={layer.opacity}
          onPointerDown={(event) => onLayerPointerDown(id, event)}
        />
      );
    case LayerType.TEXT:
      return (
        <Text id={id} layer={layer} onLayerPointerDown={onLayerPointerDown} />
      );
    default:
      return null;
  }
});

LayerRenderer.displayName = "LayerRenderer";

export default LayerRenderer;
