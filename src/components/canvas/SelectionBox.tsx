"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useSelf, useStorage } from "@liveblocks/react";
import { LayerType, ResizeHandle, type Box } from "~/types";

interface SelectionBoxProps {
  onResizeHandlePointerDown: (handle: ResizeHandle, initialBounds: Box) => void;
}

const TEXT_BOX_PADDING = 16;
const RESIZE_HANDLE_SIZE = 8;
const H = RESIZE_HANDLE_SIZE;

// ---------------------------------------------------------------------------
// Resize handle configuration table
// Each entry describes one of the 8 handles around the selection box.
// `side` is the Side bitmask passed to onResizeHandlePointerDown.
// `getX` / `getY` compute the handle's transform origin given the selected layer.
// ---------------------------------------------------------------------------
type HandleConfig = {
  cursor: string;
  side: number; // Side bitmask (e.g. Side.TOP | Side.LEFT for the top-left corner)
  getX: (x: number, y: number, w: number, h: number) => number;
  getY: (x: number, y: number, w: number, h: number) => number;
};

const HANDLE_CONFIGS: HandleConfig[] = [
  // Corners
  {
    cursor: "nw-resize",
    side: ResizeHandle.TOP + ResizeHandle.LEFT,
    getX: (x) => x - H / 2,
    getY: (_x, y) => y - H / 2,
  },
  {
    cursor: "ne-resize",
    side: ResizeHandle.TOP + ResizeHandle.RIGHT,
    getX: (x, _y, w) => x + w - H / 2,
    getY: (_x, y) => y - H / 2,
  },
  {
    cursor: "sw-resize",
    side: ResizeHandle.BOTTOM + ResizeHandle.LEFT,
    getX: (x) => x - H / 2,
    getY: (_x, y, _w, h) => y + h - H / 2,
  },
  {
    cursor: "se-resize",
    side: ResizeHandle.BOTTOM + ResizeHandle.RIGHT,
    getX: (x, _y, w) => x + w - H / 2,
    getY: (_x, y, _w, h) => y + h - H / 2,
  },
  // Edge midpoints
  {
    cursor: "ns-resize",
    side: ResizeHandle.TOP,
    getX: (x, _y, w) => x + w / 2 - H / 2,
    getY: (_x, y) => y - H / 2,
  },
  {
    cursor: "ns-resize",
    side: ResizeHandle.BOTTOM,
    getX: (x, _y, w) => x + w / 2 - H / 2,
    getY: (_x, y, _w, h) => y + h - H / 2,
  },
  {
    cursor: "ew-resize",
    side: ResizeHandle.LEFT,
    getX: (x) => x - H / 2,
    getY: (_x, y, _w, h) => y + h / 2 - H / 2,
  },
  {
    cursor: "ew-resize",
    side: ResizeHandle.RIGHT,
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
    const layers = useStorage((root) => root.layers);

    const selectedLayer = selectedLayerId ? layers?.get(selectedLayerId) : null;

    // Set svg text box width
    useEffect(() => {
      if (textRef.current) {
        const bBox = textRef.current.getBBox();
        setTextWidth(bBox.width);
      }
    }, [selectedLayer]);

    // Pre-compute each handle's pixel position so the JSX below stays clean
    // Recalculates only when the selected layer's geometry changes
    const handles = useMemo(() => {
      if (!selectedLayer || selectedLayer.type === LayerType.PATH) return [];

      const { x, y, width, height } = selectedLayer;

      return HANDLE_CONFIGS.map((cfg) => ({
        cursor: cfg.cursor,
        side: cfg.side,
        tx: cfg.getX(x, y, width, height),
        ty: cfg.getY(x, y, width, height),
      }));
    }, [selectedLayer]);

    if (!selectedLayer) return null;

    // Resize is not supported for path layers — their shape comes from freehand
    // points, not a simple bounding box, so a box-resize would be misleading!!
    const shouldResize = selectedLayer.type !== LayerType.PATH;

    return (
      <>
        {/* Selection outline */}
        <rect
          width={selectedLayer.width}
          height={selectedLayer.height}
          style={{
            transform: `translate(${selectedLayer.x}px,${selectedLayer.y}px)`,
          }}
          className="pointer-events-none fill-transparent stroke-[#0b99ff] stroke-[1px]"
        />

        {/* Dimension label background pill */}
        <rect
          x={
            selectedLayer.x +
            selectedLayer.width / 2 -
            (textWidth + TEXT_BOX_PADDING) / 2
          }
          y={selectedLayer.y + selectedLayer.height + 10}
          width={textWidth + TEXT_BOX_PADDING}
          height={20}
          rx={4}
          className="fill-[#0b99ff]"
        />

        {/* Dimension label text (e.g. "200x100") */}
        <text
          ref={textRef}
          textAnchor="middle"
          style={{
            transform: `translate(${selectedLayer.x + selectedLayer.width / 2}px,${selectedLayer.y + selectedLayer.height + 23}px)`,
          }}
          className="pointer-events-none fill-white text-[11px]"
        >
          {Math.round(selectedLayer.width)}x{Math.round(selectedLayer.height)}
        </text>

        {/* Resize handles */}
        {shouldResize &&
          handles.map(({ cursor, side, tx, ty }) => (
            <rect
              key={side}
              cursor={cursor}
              onPointerDown={(event) => {
                event.stopPropagation();
                onResizeHandlePointerDown(side, selectedLayer);
              }}
              style={{
                width: RESIZE_HANDLE_SIZE,
                height: RESIZE_HANDLE_SIZE,
                transform: `translate(${tx}px,${ty}px)`,
              }}
              className="fill-white stroke-[#0b99ff] stroke-[1px]"
            />
          ))}
      </>
    );
  },
);

SelectionBox.displayName = "SelectionBox";

export default SelectionBox;
