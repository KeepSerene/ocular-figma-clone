"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useSelf, useStorage } from "@liveblocks/react";
import { LayerType, ResizeHandle, type Box } from "~/types";
import useSelectionBoxBounds from "~/hooks/useSelectionBoxBounds";

interface SelectionBoxProps {
  onResizeHandlePointerDown: (handle: ResizeHandle, initialBounds: Box) => void;
}

const TEXT_BOX_PADDING = 16;
const RESIZE_HANDLE_SIZE = 8;
const H = RESIZE_HANDLE_SIZE;

// ---------------------------------------------------------------------------
// Resize handle configuration table
// Each entry describes one of the 8 handles around the selection box.
// `handle` is the ResizeHandle bitmask passed to onResizeHandlePointerDown.
// `getX` / `getY` compute the handle's transform origin given the selected layer.
// ---------------------------------------------------------------------------
type HandleConfig = {
  cursor: string;
  handle: number; // Resize handle bitmask (e.g. Side.TOP | Side.LEFT for the top-left corner)
  getX: (x: number, y: number, w: number, h: number) => number;
  getY: (x: number, y: number, w: number, h: number) => number;
};

const HANDLE_CONFIGS: HandleConfig[] = [
  // Corners
  {
    cursor: "nw-resize",
    handle: ResizeHandle.TOP + ResizeHandle.LEFT,
    getX: (x) => x - H / 2,
    getY: (_x, y) => y - H / 2,
  },
  {
    cursor: "ne-resize",
    handle: ResizeHandle.TOP + ResizeHandle.RIGHT,
    getX: (x, _y, w) => x + w - H / 2,
    getY: (_x, y) => y - H / 2,
  },
  {
    cursor: "sw-resize",
    handle: ResizeHandle.BOTTOM + ResizeHandle.LEFT,
    getX: (x) => x - H / 2,
    getY: (_x, y, _w, h) => y + h - H / 2,
  },
  {
    cursor: "se-resize",
    handle: ResizeHandle.BOTTOM + ResizeHandle.RIGHT,
    getX: (x, _y, w) => x + w - H / 2,
    getY: (_x, y, _w, h) => y + h - H / 2,
  },
  // Edge midpoints
  {
    cursor: "ns-resize",
    handle: ResizeHandle.TOP,
    getX: (x, _y, w) => x + w / 2 - H / 2,
    getY: (_x, y) => y - H / 2,
  },
  {
    cursor: "ns-resize",
    handle: ResizeHandle.BOTTOM,
    getX: (x, _y, w) => x + w / 2 - H / 2,
    getY: (_x, y, _w, h) => y + h - H / 2,
  },
  {
    cursor: "ew-resize",
    handle: ResizeHandle.LEFT,
    getX: (x) => x - H / 2,
    getY: (_x, y, _w, h) => y + h / 2 - H / 2,
  },
  {
    cursor: "ew-resize",
    handle: ResizeHandle.RIGHT,
    getX: (x, _y, w) => x + w - H / 2,
    getY: (_x, y, _w, h) => y + h / 2 - H / 2,
  },
];

const SelectionBox = memo(
  ({ onResizeHandlePointerDown }: SelectionBoxProps) => {
    const [textWidth, setTextWidth] = useState(0);
    const textRef = useRef<SVGTextElement>(null);

    const selectedLayerId = useSelf((me) =>
      me.presence.selections.length === 1 ? me.presence.selections[0] : null,
    );
    // Resize is not supported for path layers — their shape comes from freehand
    // points, not a simple bounding box, so a box-resize would be misleading!!
    const shouldResize = useStorage(
      (root) =>
        selectedLayerId &&
        root.layers.get(selectedLayerId)?.type !== LayerType.PATH,
    );

    const bounds = useSelectionBoxBounds();

    // Set svg text box width
    useEffect(() => {
      if (textRef.current) {
        const bBox = textRef.current.getBBox();
        setTextWidth(bBox.width);
      }
    }, [bounds]);

    // Pre-compute each handle's pixel position so the JSX below stays clean
    // Recalculates only when the selected layer's geometry changes
    const handles = useMemo(() => {
      if (!bounds) return [];

      const { x, y, width, height } = bounds;

      return HANDLE_CONFIGS.map((cfg) => ({
        cursor: cfg.cursor,
        side: cfg.handle,
        tx: cfg.getX(x, y, width, height),
        ty: cfg.getY(x, y, width, height),
      }));
    }, [bounds]);

    if (!bounds) return null;

    return (
      <>
        {/* Selection outline */}
        <rect
          width={bounds.width}
          height={bounds.height}
          style={{
            transform: `translate(${bounds.x}px,${bounds.y}px)`,
          }}
          className="stroke-primary pointer-events-none fill-transparent stroke-[1px]"
        />

        {/* Dimension label background pill */}
        <rect
          x={bounds.x + bounds.width / 2 - (textWidth + TEXT_BOX_PADDING) / 2}
          y={bounds.y + bounds.height + 10}
          width={textWidth + TEXT_BOX_PADDING}
          height={20}
          rx={4}
          className="fill-primary pointer-events-none"
        />

        {/* Dimension label text (e.g. "200x100") */}
        <text
          ref={textRef}
          textAnchor="middle"
          style={{
            transform: `translate(${bounds.x + bounds.width / 2}px,${bounds.y + bounds.height + 23}px)`,
          }}
          className="fill-primary-foreground pointer-events-none text-[11px] select-none"
        >
          {Math.round(bounds.width)}x{Math.round(bounds.height)}
        </text>

        {/* Resize handles */}
        {shouldResize &&
          handles.map(({ cursor, side, tx, ty }) => (
            <rect
              key={side}
              cursor={cursor}
              onPointerDown={(event) => {
                event.stopPropagation();
                onResizeHandlePointerDown(side, bounds);
              }}
              style={{
                width: RESIZE_HANDLE_SIZE,
                height: RESIZE_HANDLE_SIZE,
                transform: `translate(${tx}px,${ty}px)`,
              }}
              className="fill-primary/80 stroke-primary stroke-[1px]"
            />
          ))}
      </>
    );
  },
);

SelectionBox.displayName = "SelectionBox";

export default SelectionBox;
