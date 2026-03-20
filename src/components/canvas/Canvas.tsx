"use client";

import { useMutation, useStorage } from "@liveblocks/react";
import { useMemo, useState } from "react";
import { colorObjToHex, screenToCanvas } from "~/lib/utils";
import CustomLayer from "./CustomLayer";
import {
  LayerType,
  type Camera,
  type Point,
  type RectangleLayer,
} from "~/types";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import type { LiveLayer } from "liveblocks.config";

const MAX_LAYERS = 100;

function Canvas() {
  const canvasColor = useStorage((root) => root.canvasColor);
  const layerIds = useStorage((root) => root.layerIds);

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });

  const hexColor = useMemo(() => {
    return canvasColor ? colorObjToHex(canvasColor) : "#1e1e1e";
  }, [canvasColor]);

  const insertLayer = useMutation(
    (
      { storage, setMyPresence },
      layerType: LayerType.RECTANGLE | LayerType.ELLIPSE | LayerType.TEXT,
      position: Point,
    ) => {
      const liveLayers = storage.get("layers");

      if (liveLayers.size > MAX_LAYERS) return;

      const liveLayerIds = storage.get("layerIds");
      const layerId = nanoid();
      let layer: LiveObject<LiveLayer> | null = null;

      if (layerType === LayerType.RECTANGLE) {
        layer = new LiveObject<RectangleLayer>({
          type: LayerType.RECTANGLE,
          x: position.x,
          y: position.y,
          width: 100,
          height: 100,
          fill: { r: 217, g: 217, b: 217 },
          stroke: { r: 217, g: 217, b: 217 },
          opacity: 100,
        });
      }

      if (layer) {
        liveLayerIds.push(layerId);
        liveLayers.set(layerId, layer);

        setMyPresence({ selections: [layerId] }, { addToHistory: true });
      }
    },
    [],
  );

  const handlePointerUp = useMutation(
    ({}, event: React.PointerEvent) => {
      // Guard: Liveblocks storage not loaded yet
      if (layerIds === null || layerIds === undefined) return;

      const point = screenToCanvas(event, camera);
      insertLayer(LayerType.RECTANGLE, point);
    },
    [layerIds], // necessary for the guard above
  );

  return (
    <div className="flex h-dvh w-full">
      <main className="fixed inset-0 h-dvh overflow-y-auto">
        <div
          style={{ backgroundColor: hexColor }}
          className="size-full touch-none"
        >
          <svg onPointerUp={handlePointerUp} className="size-full">
            <g>
              {layerIds?.map((id) => (
                <CustomLayer key={id} id={id} />
              ))}
            </g>
          </svg>
        </div>
      </main>
    </div>
  );
}

export default Canvas;
