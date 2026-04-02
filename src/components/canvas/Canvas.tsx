"use client";

import {
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useSelf,
  useStorage,
} from "@liveblocks/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  pencilDraftToPathLayer,
  colorObjToHex,
  screenToCanvas,
  resizeBounds,
  findIntersectingLayerIdsWithRect,
} from "~/lib/utils";
import LayerRenderer from "./LayerRenderer";
import {
  CanvasMode,
  LayerType,
  type ResizeHandle,
  type Box,
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
import SelectionBox from "./SelectionBox";
import useDeleteLayers from "~/hooks/useDeleteLayers";
import LayerContextMenu from "./LayerContextMenu";
import Sidebars from "./sidebars/Sidebars";
import LivePresence from "./LivePresence";
import type { Invitee } from "~/app/dashboard/designs/[designId]/page";

interface CanvasProps {
  roomId: string;
  roomTitle: string;
  invitees: Invitee[];
}

const MAX_LAYERS = 100;
const ON_CANVAS_DEFAULT_COLOR = { r: 214, g: 214, b: 214 } as Color;

function Canvas({ roomId, roomTitle, invitees }: CanvasProps) {
  const canvasColor = useStorage((root) => root.canvasColor);
  const layerIds = useStorage((root) => root.layerIds);
  const pencilDraft = useSelf((me) => me.presence.pencilDraft);
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const deleteLayers = useDeleteLayers();

  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0, zoom: 1 });
  const [canvasState, setCanvasState] = useState<CanvasState>({
    mode: CanvasMode.MOVING,
  });
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);

  const hexColor = useMemo(() => {
    return canvasColor ? colorObjToHex(canvasColor) : "#1a1a1e";
  }, [canvasColor]);

  // ---------------------------------------------------------------------------
  // Layer insertion
  // ---------------------------------------------------------------------------

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
          width: 200,
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
          width: 200,
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
          height: 50,
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

  // ---------------------------------------------------------------------------
  // Pencil / freehand drawing
  // ---------------------------------------------------------------------------

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
        // Delete the initial point added to presence by startDrawing()
        setMyPresence({ pencilDraft: null });

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
      // Set the penColor and add the initialPoint & pressure to the pencilDraft
      // array to start drawing
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

      // If not in pencil mode, pencilDraft is null, or not pressing down the
      // mouse left button (buttons === 1), do nothing
      if (
        canvasState.mode !== CanvasMode.PENCIL ||
        !pencilDraft ||
        event.buttons !== 1
      ) {
        return;
      }

      // Append the current canvas-space point and pressure to the cursor & the draft
      setMyPresence({
        cursor: currentPoint,
        pencilDraft: [
          ...pencilDraft,
          [currentPoint.x, currentPoint.y, event.pressure],
        ],
      });
    },
    [canvasState.mode],
  );

  // ---------------------------------------------------------------------------
  // Layer resizing
  // ---------------------------------------------------------------------------

  const resizeSelectedLayer = useMutation(
    ({ self, storage }, point: Point) => {
      if (canvasState.mode !== CanvasMode.RESIZING) {
        return;
      }

      const bounds = resizeBounds(
        canvasState.initialBounds,
        canvasState.handle,
        point,
      );

      // Apply the new bounds to whichever layer is currently selected.
      // Only one layer is selectable at a time during resize!
      const liveLayers = storage.get("layers");
      const selectedLayerId = self.presence.selections[0];

      if (!selectedLayerId) return;

      const layer = liveLayers.get(selectedLayerId);

      if (!layer) return;

      layer.update(bounds);
    },
    [canvasState],
  );

  // ---------------------------------------------------------------------------
  // Selection helpers
  // ---------------------------------------------------------------------------

  const unselectLayers = useMutation(({ self, setMyPresence }) => {
    if (self.presence.selections.length > 0) {
      setMyPresence({ selections: [] }, { addToHistory: true });
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Layer translation (moving selected layers around the canvas)
  // ---------------------------------------------------------------------------

  const translateSelectedLayers = useMutation(
    ({ self, storage }, cursorPos: Point) => {
      if (canvasState.mode !== CanvasMode.TRANSLATING) {
        return;
      }

      // Compute how far the pointer moved since the last pointermove event
      const offsets = {
        x: cursorPos.x - canvasState.cursorPos.x,
        y: cursorPos.y - canvasState.cursorPos.y,
      };
      const liveLayers = storage.get("layers");

      // Move every selected layer by the same delta — supports multi-selection
      // (e.g. layers selected via a selection net are all translated together)
      for (const layerId of self.presence.selections) {
        const selectedLayer = liveLayers.get(layerId);

        if (selectedLayer) {
          selectedLayer.update({
            x: selectedLayer.get("x") + offsets.x,
            y: selectedLayer.get("y") + offsets.y,
          });
        }
      }

      // Advance the stored cursor position so the next pointermove delta is
      // computed relative to this frame, not the original press origin
      setCanvasState({ mode: CanvasMode.TRANSLATING, cursorPos });
    },
    [canvasState],
  );

  // ---------------------------------------------------------------------------
  // Selection net (rubber-band multi-select)
  // ---------------------------------------------------------------------------

  const startSelectionNet = useCallback(
    (currentCursorPos: Point, origin: Point) => {
      const distanceSquared =
        (currentCursorPos.x - origin.x) ** 2 +
        (currentCursorPos.y - origin.y) ** 2;

      // 5 px threshold prevents jitter from tiny accidental movements from
      // being mistaken for intentional net-drag gestures
      if (Math.sqrt(distanceSquared) > 5) {
        setCanvasState({
          mode: CanvasMode.SELECTION_NET,
          initialCursorPos: origin,
          currentCursorPos,
        });
      }
    },
    [setCanvasState],
  );

  const updateSelectionNet = useMutation(
    ({ setMyPresence, storage }, origin: Point, currentCursorPos: Point) => {
      if (!layerIds) return;

      // Keep the net rect in sync so the SelectionNet SVG component can render it
      setCanvasState({
        mode: CanvasMode.SELECTION_NET,
        initialCursorPos: origin,
        currentCursorPos,
      });
      const immutableLayers = storage
        .get("layers")
        .toImmutable() as unknown as ReadonlyMap<string, Readonly<LiveLayer>>;

      const intersectingLayerIds = findIntersectingLayerIdsWithRect(
        layerIds,
        immutableLayers,
        origin,
        currentCursorPos,
      );

      // Broadcast the updated selection to all collaborators via presence
      setMyPresence({ selections: intersectingLayerIds });
    },
    [layerIds, setCanvasState],
  );

  // ---------------------------------------------------------------------------
  // Pointer event handlers
  // ---------------------------------------------------------------------------

  const handlePointerDown = useMutation(
    ({}, event: React.PointerEvent) => {
      const point = screenToCanvas(event, camera);

      if (canvasState.mode === CanvasMode.DRAGGING) {
        // Record where the pan gesture started
        setCanvasState({ mode: CanvasMode.DRAGGING, origin: point });
      } else if (canvasState.mode === CanvasMode.PENCIL) {
        startDrawing(point, event.pressure);
      } else if (canvasState.mode === CanvasMode.INSERTING) {
        // Do NOT transition to PRESSING here.
        //
        // Bug scenario (without this guard):
        //   1. User is in INSERTING mode.
        //   2. pointerdown -> falls to `else` -> sets PRESSING.
        //   3. React flushes the state update between browser events.
        //   4. pointermove fires -> sees PRESSING -> startSelectionNet() is called.
        //   5. Canvas enters SELECTION_NET.
        //   6. pointerup → sees SELECTION_NET -> goes to MOVING.
        //   7. insertLayer() is NEVER called — shape silently fails to insert.
        //
        // By returning early we keep the mode as INSERTING so that
        // handlePointerUp can correctly call insertLayer() on release.
        return;
      } else {
        // Default: user pressed on empty canvas in a neutral mode.
        // Transition to PRESSING — the gesture will be resolved in
        // handlePointerMove (-> SELECTION_NET) or handlePointerUp (-> deselect).
        setCanvasState({ mode: CanvasMode.PRESSING, origin: point });
      }
    },
    [camera, canvasState.mode, setCanvasState, startDrawing],
  );

  const handlePointerMove = useMutation(
    ({ setMyPresence }, event: React.PointerEvent) => {
      const point = screenToCanvas(event, camera);

      if (canvasState.mode === CanvasMode.PRESSING) {
        // The user pressed on empty canvas and is now dragging — try to
        // upgrade the gesture to a selection net
        startSelectionNet(point, canvasState.origin);
      } else if (canvasState.mode === CanvasMode.SELECTION_NET) {
        // The selection net is already active — keep updating it as the
        // pointer moves so selections are reflected in real-time
        updateSelectionNet(canvasState.initialCursorPos, point);
      } else if (
        canvasState.mode === CanvasMode.DRAGGING &&
        canvasState.origin !== null
      ) {
        // Pan the camera by how far the pointer moved in screen space.
        // We use movementX/Y here (not canvas-space delta) because panning is
        // a screen-space operation — it shifts the camera offset in pixels.
        setCamera((prev) => ({
          ...prev,
          x: prev.x + event.movementX,
          y: prev.y + event.movementY,
        }));
      } else if (canvasState.mode === CanvasMode.PENCIL) {
        continueDrawing(point, event);
      } else if (canvasState.mode === CanvasMode.RESIZING) {
        resizeSelectedLayer(point);
      } else if (canvasState.mode === CanvasMode.TRANSLATING) {
        translateSelectedLayers(point);
      }

      setMyPresence({ cursor: point });
    },
    [
      camera,
      canvasState,
      startSelectionNet,
      updateSelectionNet,
      setCamera,
      continueDrawing,
      resizeSelectedLayer,
      translateSelectedLayers,
    ],
  );

  const handlePointerUp = useMutation(
    ({}, event: React.PointerEvent) => {
      if (canvasState.mode === CanvasMode.RIGHT_CLICK) {
        /*
         * `handleLayerPointerDown()` calls `history.pause()` before entering this mode.
         * Without resuming, subsequent mutations become part of the paused batch instead of creating separate undo steps.
         */
        history.resume();
        return;
      }

      // Guard: Liveblocks storage not loaded yet
      if (layerIds === null || layerIds === undefined) return;

      const point = screenToCanvas(event, camera);

      if (
        canvasState.mode === CanvasMode.MOVING ||
        canvasState.mode === CanvasMode.PRESSING
      ) {
        // Clicked empty canvas without dragging → deselect everything
        unselectLayers();
        setCanvasState({ mode: CanvasMode.MOVING });
      } else if (canvasState.mode === CanvasMode.INSERTING) {
        // Commit the new layer at the release position
        insertLayer(canvasState.layer, point);
        // Return to MOVING after one insertion — matches standard Figma
        // behaviour where the tool deselects itself after a single use
        setCanvasState({ mode: CanvasMode.MOVING });
      } else if (canvasState.mode === CanvasMode.DRAGGING) {
        // Clear the drag origin so a future pointerdown can start a new pan
        setCanvasState({ mode: CanvasMode.DRAGGING, origin: null });
      } else if (canvasState.mode === CanvasMode.PENCIL) {
        // Commit the freehand stroke as a persistent PathLayer
        insertPath();
        // Switch to MOVING so the user can immediately select/move the new path
        // without having to manually deactivate the pencil tool
        setCanvasState({ mode: CanvasMode.MOVING });
      } else if (canvasState.mode === CanvasMode.SELECTION_NET) {
        // The rubber-band selection is complete.
        // Selections were already updated in real-time by updateSelectionNet(),
        // so there is nothing extra to commit here — just dismiss the net.
        setCanvasState({ mode: CanvasMode.MOVING });
      } else {
        // Covers RESIZING and TRANSLATING:
        // mutations were applied live during pointermove, so just return to
        // MOVING so the pointer can be used normally again
        setCanvasState({ mode: CanvasMode.MOVING });
      }

      history.resume();
    },
    [
      layerIds,
      camera,
      canvasState,
      setCanvasState,
      unselectLayers,
      insertLayer,
      insertPath,
      history,
    ],
  );

  const handlePointerLeave = useMutation(({ setMyPresence }) => {
    setMyPresence({ cursor: null });
  }, []);

  // ---------------------------------------------------------------------------
  // Camera / zoom
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Layer-level pointer handlers
  // ---------------------------------------------------------------------------

  const handleLayerPointerDown = useMutation(
    ({ self, setMyPresence }, layerId: string, event: React.PointerEvent) => {
      if (
        canvasState.mode === CanvasMode.INSERTING ||
        canvasState.mode === CanvasMode.PENCIL
      ) {
        return;
      }

      history.pause();
      event.stopPropagation();

      if (!self.presence.selections.includes(layerId)) {
        // Replace the current selection with the clicked layer.
        // If the user later wants multi-select they can use the selection net.
        setMyPresence({ selections: [layerId] }, { addToHistory: true });
      }

      if (event.nativeEvent.buttons === 2) {
        // Right-click menu mode
        setCanvasState({ mode: CanvasMode.RIGHT_CLICK });
      } else {
        // If the layer was already selected (including as part of a multi-select
        // from a selection net), we do NOT change the selections — all selected
        // layers will be translated together.
        const point = screenToCanvas(event, camera);
        setCanvasState({ mode: CanvasMode.TRANSLATING, cursorPos: point });
      }
    },
    [canvasState.mode, history, camera],
  );

  const handleResizeHandlePointerDown = useCallback(
    (handle: ResizeHandle, initialBounds: Box) => {
      history.pause();
      setCanvasState({
        mode: CanvasMode.RESIZING,
        handle,
        initialBounds,
      });
    },
    [history, setCanvasState],
  );

  // ---------------------------------------------------------------------------
  // All layers selection
  // ---------------------------------------------------------------------------

  const selectAllLayers = useMutation(
    ({ setMyPresence }) => {
      if (layerIds) {
        setMyPresence({ selections: [...layerIds] }, { addToHistory: true });
      }
    },
    [layerIds],
  );

  // ---------------------------------------------------------------------------
  // Handle keyboard shortcuts
  // ---------------------------------------------------------------------------

  /*
   * Backspace: delete selected layers
   * Ctrl + z: Undo last action
   * Ctrl + Shift + Z: Redo last action
   * Ctrl + a: Select all inserted layers
   */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      // Check if it's the Text layer input field
      const isInputField =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA");

      if (isInputField) return;

      switch (event.key.toLowerCase()) {
        // lowercasing event.key to handle both uppercase and lowercase key presses
        // e.g. undo is Ctrl + z while redo is Ctrl + Shift + Z
        case "backspace":
          event.preventDefault();
          deleteLayers();
          break;
        case "z":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();

            if (event.shiftKey) {
              history.redo();
            } else {
              history.undo();
            }
          }
          break;
        case "a":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            selectAllLayers();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deleteLayers, history, selectAllLayers]);

  return (
    <div className="flex h-dvh w-full">
      <main className="fixed inset-0 h-dvh overflow-y-auto">
        <div
          style={{ backgroundColor: hexColor }}
          className={`size-full touch-none ${
            canvasState.mode === CanvasMode.DRAGGING
              ? canvasState.origin !== null
                ? "cursor-grabbing"
                : "cursor-grab"
              : "cursor-default"
          }`}
        >
          {/* Right-click layer context menu */}
          {canvasState.mode === CanvasMode.RIGHT_CLICK && (
            <LayerContextMenu camera={camera} />
          )}

          {/* Canvas */}
          <svg
            onWheel={handleOnWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onContextMenu={(event) => event.preventDefault()} // stop the default browser menu
            className="size-full"
          >
            {/*
             * Camera transform group — everything inside is rendered in
             * canvas space (panned + zoomed). All child coordinates use
             * canvas space (not screen space).
             */}
            <g
              style={{
                transform: `translate(${camera.x}px,${camera.y}px) scale(${camera.zoom})`,
              }}
            >
              {/* Render each persisted layer */}
              {layerIds?.map((id) => (
                <LayerRenderer
                  key={id}
                  id={id}
                  onLayerPointerDown={handleLayerPointerDown}
                />
              ))}

              {/*
               * Live pencil preview — pencilDraft points are in absolute
               * canvas space (not relative to a layer origin), so x/y are 0.
               * The <g> above already handles the camera alignment.
               * Without this preview, the user would see nothing while
               * drawing until they release the pointer and insertPath() runs.
               */}
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

              {/* Selected layer bounding box */}
              <SelectionBox
                onResizeHandlePointerDown={handleResizeHandlePointerDown}
              />

              {/* Selection net */}
              {canvasState.mode === CanvasMode.SELECTION_NET &&
                canvasState.currentCursorPos && (
                  <rect
                    // Normalise the rect so it draws correctly in all drag directions
                    x={Math.min(
                      canvasState.initialCursorPos.x,
                      canvasState.currentCursorPos.x,
                    )}
                    y={Math.min(
                      canvasState.initialCursorPos.y,
                      canvasState.currentCursorPos.y,
                    )}
                    width={Math.abs(
                      canvasState.currentCursorPos.x -
                        canvasState.initialCursorPos.x,
                    )}
                    height={Math.abs(
                      canvasState.currentCursorPos.y -
                        canvasState.initialCursorPos.y,
                    )}
                    strokeWidth={1}
                    strokeDasharray="4 2"
                    className="fill-primary/5 stroke-primary pointer-events-none"
                  />
                )}

              {/* Live presence */}
              <LivePresence />
            </g>
          </svg>
        </div>
      </main>

      <Toolbar
        canvasState={canvasState}
        setCanvasState={setCanvasState}
        canUndo={canUndo}
        undo={() => history.undo()}
        canRedo={canRedo}
        redo={() => history.redo()}
        canZoomIn={camera.zoom < 2}
        zoomIn={() => {
          setCamera((prev) => ({ ...prev, zoom: prev.zoom + 0.1 }));
        }}
        canZoomOut={camera.zoom > 0.5}
        zoomOut={() => {
          setCamera((prev) => ({ ...prev, zoom: prev.zoom - 0.1 }));
        }}
      />

      <Sidebars
        roomId={roomId}
        roomTitle={roomTitle}
        invitees={invitees}
        isLeftCollapsed={isLeftSidebarCollapsed}
        setIsLeftCollapsed={setIsLeftSidebarCollapsed}
      />
    </div>
  );
}

export default Canvas;
