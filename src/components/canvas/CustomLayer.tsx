import { useStorage } from "@liveblocks/react";
import { memo } from "react";
import { LayerType } from "~/types";
import Rectangle from "./Rectangle";

const CustomLayer = memo(({ id }: { id: string }) => {
  const layer = useStorage((root) => root.layers.get(id));

  if (!layer) {
    return null;
  }

  switch (layer.type) {
    case LayerType.RECTANGLE:
      return <Rectangle id={id} layer={layer} />;
    default:
      return null;
  }
});

CustomLayer.displayName = "CustomLayer";

export default CustomLayer;
