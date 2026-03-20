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
  opacity: number; // 1-100
};

export type EllipseLayer = {
  type: LayerType.ELLIPSE;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: Color;
  stroke: Color; // border color
  opacity: number; // 1-100
};

export type PathLayer = {
  type: LayerType.PATH;
  x: number;
  y: number;
  points: Point[]; // [[x1, y1],[x2, y2],...]
  width: number;
  height: number;
  fill: Color;
  stroke: Color; // border color
  opacity: number; // 1-100
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
  opacity: number; // 1-100
};

export type Layer = RectangleLayer | EllipseLayer | PathLayer | TextLayer;
