"use client";

import { useMutation, useSelf, useStorage } from "@liveblocks/react";
import { useCallback, useMemo, useState } from "react";
import {
  pencilDraftToPathLayer,
  colorObjToHex,
  screenToCanvas,
} from "~/lib/utils";
import CustomLayer from "./CustomLayer";
import {
  CanvasMode,
  LayerType,
  type Camera,
  type CanvasState,
  type Color,
  type EllipseLayer,
  type Point,
  type RectangleLayer,
  type TextLayer,
} from "~/types";
import { nanoid } from "nanoid";
import { LiveObject } from "@liveblocks/client";
import type { LiveLayer } from "liveblocks.config";
import Toolbar from "../toolbar/Toolbar";
import Path from "./Path";

const MAX_LAYERS = 100;
const ON_CANVAS_DEFAULT_COLOR = { r: 217, g: 217, b: 217 } as Color;

function Canvas() {
  const canvasColor = useStorage((root) => root.canvasColor);
  const layerIds = useStorage((root) => root.layerIds);
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.MOVING,
  });

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

      if (liveLayers.size >= MAX_LAYERS) return;

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
          fill: ON_CANVAS_DEFAULT_COLOR,
          stroke: ON_CANVAS_DEFAULT_COLOR,
          opacity: 1,
        });
      } else if (layerType === LayerType.ELLIPSE) {
        layer = new LiveObject<EllipseLayer>({
          type: LayerType.ELLIPSE,
          x: position.x,
          y: position.y,
          width: 100,
          height: 100,
          fill: ON_CANVAS_DEFAULT_COLOR,
          stroke: ON_CANVAS_DEFAULT_COLOR,
          opacity: 1,
        });
      } else if (layerType === LayerType.TEXT) {
        layer = new LiveObject<TextLayer>({
          type: LayerType.TEXT,
          x: position.x,
          y: position.y,
          width: 100,
          height: 100,
          text: "Text...",
          fontFamily: "Inter",
          fontSize: 16,
          fontWeight: 400,
          fill: ON_CANVAS_DEFAULT_COLOR,
          stroke: ON_CANVAS_DEFAULT_COLOR,
          opacity: 1,
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

  const insertPath = useMutation(
    ({ storage, self, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const liveLayerIds = storage.get("layerIds");
      const { pencilDraft } = self.presence;

      if (
        !pencilDraft ||
        pencilDraft.length < 2 ||
        liveLayers.size >= MAX_LAYERS
      ) {
        setMyPresence({ pencilDraft: null }); // delete the initial point added to presence data by startDrawing() function

        return;
      }

      const pathLayerId = nanoid();
      liveLayerIds.push(pathLayerId);
      liveLayers.set(
        pathLayerId,
        new LiveObject(
          pencilDraftToPathLayer(pencilDraft, ON_CANVAS_DEFAULT_COLOR),
        ),
      );
      // Clear pencilDraft after a successful insert
      setMyPresence({ pencilDraft: null });
      // Reset pencil mode so that the user can draw a new path
      setCanvasState({ mode: CanvasMode.PENCIL });
    },
    [setCanvasState],
  );

  const startDrawing = useMutation(
    ({ setMyPresence }, initialPoint: Point, pressure: number) => {
      // Set the penColor and add the initialPoint & pressure to the pencilDraft array to start drawing
      setMyPresence({
        penColor: ON_CANVAS_DEFAULT_COLOR,
        pencilDraft: [[initialPoint.x, initialPoint.y, pressure]],
      });
    },
    [],
  );

  const continueDrawing = useMutation(
    (
      { self, setMyPresence },
      currentPoint: Point,
      event: React.PointerEvent,
    ) => {
      // Get current pencil draft
      const { pencilDraft } = self.presence;

      // If not in pencil mode, pencilDraft is null, or not pressing down the mouse left button (1), simply do nothing (return)
      if (
        canvasState.mode !== CanvasMode.PENCIL ||
        !pencilDraft ||
        event.buttons !== 1
      ) {
        return;
      }

      // Update pencilDraft with the current point being move onto & the current pressure
      setMyPresence({
        pencilDraft: [
          ...pencilDraft,
          [currentPoint.x, currentPoint.y, event.pressure],
        ],
      });
    },
    [canvasState.mode],
  );

  const handlePointerDown = useMutation(
    ({}, event: React.PointerEvent) => {
      // Get the point where user clicked
      const point = screenToCanvas(event, camera);

      if (canvasState.mode === CanvasMode.DRAGGING) {
        // Set the origin of dragging
        setCanvasState({ mode: CanvasMode.DRAGGING, origin: point });
      } else if (canvasState.mode === CanvasMode.PENCIL) {
        startDrawing(point, event.pressure);
      }
    },
    [camera, canvasState.mode, setCanvasState, startDrawing],
  );

  const handlePointerMove = useMutation(
    ({}, event: React.PointerEvent) => {
      // Get the point where user clicked
      const point = screenToCanvas(event, camera);

      // If the canvas is in dragging mode and user actually clicked on the canvas
      // to set a dragging origin
      if (
        canvasState.mode === CanvasMode.DRAGGING &&
        canvasState.origin !== null
      ) {
        setCamera((prev) => ({
          ...prev,
          x: prev.x + event.movementX,
          y: prev.y + event.movementY,
        }));
      } else if (canvasState.mode === CanvasMode.PENCIL) {
        continueDrawing(point, event);
      }
    },
    [canvasState, setCamera, continueDrawing],
  );

  const handlePointerUp = useMutation(
    ({}, event: React.PointerEvent) => {
      // Guard: Liveblocks storage not loaded yet
      if (layerIds === null || layerIds === undefined) return;

      // Get the point where user clicked
      const point = screenToCanvas(event, camera);

      if (canvasState.mode === CanvasMode.MOVING) {
        setCanvasState({ mode: CanvasMode.MOVING });
      } else if (canvasState.mode === CanvasMode.INSERTING) {
        insertLayer(canvasState.layer, point);
        // Return to moving mode after insertion so subsequent double-clicks
        // on a text layer trigger edit mode instead of inserting a new text layer
        // This also matches standard Figma behaviour (tool deselects after one use)
        setCanvasState({ mode: CanvasMode.MOVING });
      } else if (canvasState.mode === CanvasMode.DRAGGING) {
        // Stop dragging when user releases the mouse pointer button
        setCanvasState({ mode: CanvasMode.DRAGGING, origin: null });
      } else if (canvasState.mode === CanvasMode.PENCIL) {
        insertPath();
      }
    },
    [layerIds, camera, canvasState, setCanvasState, insertLayer, insertPath], // necessary for the guard above
  );

  const handleOnWheel = useCallback(
    (event: React.WheelEvent) => {
      setCamera((prev) => ({
        ...prev,
        x: prev.x - event.deltaX,
        y: prev.y - event.deltaY,
      }));
    },
    [setCamera],
  );

  return (
    <div className="flex h-dvh w-full">
      <main className="fixed inset-0 h-dvh overflow-y-auto">
        <div
          style={{ backgroundColor: hexColor }}
          className={`size-full touch-none ${canvasState.mode === CanvasMode.DRAGGING ? (canvasState.origin !== null ? "cursor-grabbing" : "cursor-grab") : "cursor-default"}`}
        >
          <svg
            onWheel={handleOnWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="size-full"
          >
            <g
              style={{
                transform: `translate(${camera.x}px,${camera.y}px) scale(${camera.zoom})`,
              }}
            >
              {layerIds?.map((id) => (
                <CustomLayer key={id} id={id} />
              ))}

              {/* Live preview: pencilDraft points are already in absolute canvas space,
              so x/y are 0 — no extra translate. The <g> above handles camera alignment. */}
              {/* Without it, a user won't see the path they are drawing until they releases the left mouse button */}
              {pencilDraft && pencilDraft.length > 1 && (
                <Path
                  x={0}
                  y={0}
                  points={pencilDraft}
                  fill={ON_CANVAS_DEFAULT_COLOR}
                  stroke={ON_CANVAS_DEFAULT_COLOR}
                  opacity={1}
                />
              )}
            </g>
          </svg>
        </div>
      </main>

      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canZoomIn={camera.zoom <= 2}
        zoomIn={() => {
          setCamera((prev) => ({ ...prev, zoom: prev.zoom + 0.1 }));
        }}
        canZoomOut={camera.zoom >= 0.5}
        zoomOut={() => {
          setCamera((prev) => ({ ...prev, zoom: prev.zoom - 0.1 }));
        }}
      />
    </div>
  );
}

export default Canvas;
