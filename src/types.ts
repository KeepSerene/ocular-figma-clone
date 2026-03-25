export type Point = {
  x: number;
  y: number;
};
// Point (0, 0) is the top-left corner

export type Color = {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
};

export type Camera = {
  x: number;
  y: number;
  zoom: number;
};

export enum LayerType {
  RECTANGLE,
  ELLIPSE,
  PATH,
  TEXT,
}

export type RectangleLayer = {
  type: LayerType.RECTANGLE;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  stroke: Color; // border color
  cornerRadius?: number;
  opacity: number; // 0-1
};

export type EllipseLayer = {
  type: LayerType.ELLIPSE;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  stroke: Color; // border color
  opacity: number; // 0-1
};

export type PathLayer = {
  type: LayerType.PATH;
  x: number;
  y: number;
  // Points is stored as tuples [x, y, pressure] — relative to the layer origin (x, y)
  // pressure (0–1) is preserved here for variable-width stroke rendering
  points: [number, number, number][];
  width: number;
  height: number;
  fill: Color;
  stroke: Color;
  opacity: number; // 0-1
};

export type TextLayer = {
  type: LayerType.TEXT;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fill: Color;
  stroke: Color; // border color
  opacity: number; // 0-1
};

export type Layer = RectangleLayer | EllipseLayer | PathLayer | TextLayer;

export enum CanvasMode {
  MOVING, // for moving cursor (pointer) freely
  INSERTING, // for inserting a layer on the canvas
  DRAGGING, // for dragging a layer on the canvas
  PENCIL, // for free-hand drawing
  RESIZING, // for selecting & resizing layers
  TRANSLATING, // for selecting layers, moving them around, and/or resizing them
  SELECTION_NET, // for selecting every layer inside the net
  PRESSING, // for deselecting every selected layer (simply pressing down on the canvas)
  // PRESSING helps us determine if user wants to deselect every selected layer or they want to trigger a selection-net
  RIGHT_CLICK, // for right-clicking layers & switching their z-indices
}

export type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
};

// Bitmask flags (each side is a power of 2 => they occupy exactly one unique bit in binary!)
export enum ResizeHandle {
  TOP = 1, // 0001 in binary
  BOTTOM = 2, // 0010 in binary
  LEFT = 4, // 0100 in binary
  RIGHT = 8, // 1000 in binary
}

export type CanvasState =
  | {
      mode: CanvasMode.MOVING;
    }
  | {
      mode: CanvasMode.INSERTING;
      layer: LayerType.RECTANGLE | LayerType.ELLIPSE | LayerType.TEXT;
    }
  | {
      mode: CanvasMode.DRAGGING;
      origin: Point | null;
    }
  | {
      mode: CanvasMode.PENCIL;
    }
  | {
      mode: CanvasMode.RESIZING;
      handle: ResizeHandle;
      initialBounds: Box;
    }
  | {
      mode: CanvasMode.TRANSLATING;
      cursorPos: Point;
    }
  | {
      mode: CanvasMode.SELECTION_NET;
      initialCursorPos: Point;
      currentCursorPos?: Point;
    }
  | {
      mode: CanvasMode.PRESSING;
      origin: Point;
    }
  | {
      mode: CanvasMode.RIGHT_CLICK;
    };
