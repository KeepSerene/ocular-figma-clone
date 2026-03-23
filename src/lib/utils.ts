import {
  LayerType,
  type Camera,
  type Color,
  type PathLayer,
  type Point,
} from "~/types";

/**
 * Converts an RGB color object to a hex string.
 * @param color - An object with r, g, and b properties (0-255).
 * @returns A hex color string (e.g., "#ff0000").
 */
export function colorObjToHex(color: Color): string {
  const { r, g, b } = color;

  // Convert each channel to a hex string and pad with a leading zero if needed
  const toHex = (channel: number) => {
    const hex = channel.toString(16);

    return hex.length === 1 ? `0${hex}` : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Converts a browser pointer event's screen coordinates to canvas coordinates,
 * accounting for camera pan and zoom.
 * @param event - The pointer event from the SVG element.
 * @param camera - The current camera state (pan offset + zoom level).
 * @returns The corresponding point in canvas space.
 */
export const screenToCanvas = (
  event: React.PointerEvent,
  camera: Camera,
): Point => ({
  x: (event.clientX - camera.x) / camera.zoom,
  y: (event.clientY - camera.y) / camera.zoom,
});

/**
 * Converts a raw pencil draft (captured from pointer events) into a `PathLayer`
 * ready to be stored in Liveblocks.
 *
 * @param points - A flat array of captured pointer samples, where each entry is
 *   a three-element tuple `[x, y, pressure]`:
 *   - `x` / `y` — absolute position in **canvas space** (already transformed
 *     out of screen space via `screenToCanvas`)
 *   - `pressure` — the pointer's pressure at that sample (0–1), captured from
 *     `PointerEvent.pressure`. Preserved so `perfect-freehand` can vary stroke
 *     width via its `thinning` option at render time.
 *
 *   Points are normalized internally: the bounding-box origin (minX, minY)
 *   is extracted as the layer's `x`/`y`, and every point is stored **relative**
 *   to that origin so they don't double-count the offset at render time.
 *
 * @param penColor - The RGB color object to apply to both `fill` and `stroke` of the
 *   resulting path.
 *
 * @returns A fully constructed `PathLayer` with a computed bounding box,
 *   normalized origin-relative points, and pressure preserved per sample.
 */
export function pencilDraftToPathLayer(
  points: number[][], // [x, y, pressure][]
  penColor: Color,
): PathLayer {
  // 1. Compute the bounding box boundaries over all raw canvas points
  // This gives us the layer's origin (x, y) and dimensions (width, height)
  let minX = Infinity; // left edge
  let minY = Infinity; // top edge
  let maxX = -Infinity; // right edge
  let maxY = -Infinity; // bottom edge

  // Fix the bounding box
  for (const point of points) {
    const x = point[0]!;
    const y = point[1]!;

    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }

  // 2. Normalize each point relative to the bounding-box origin (minX, minY)
  const normalizedPoints: [number, number, number][] = points.map((point) => [
    point[0]! - minX, // x relative to layer origin
    point[1]! - minY, // y relative to layer origin
    point[2]!, // pressure - untouched
  ]);

  // 3. Assemble and return the PathLayer
  return {
    type: LayerType.PATH,
    x: minX, // top-left x of the bounding box in canvas space
    y: minY, // top-left y of the bounding box in canvas space
    width: maxX - minX,
    height: maxY - minY,
    points: normalizedPoints,
    fill: penColor,
    stroke: penColor,
    opacity: 1,
  };
}

/**
 * Converts the raw polygon output of `perfect-freehand`'s `getStroke()` into
 * an SVG path `d` attribute string.
 *
 * `getStroke` returns the outline of the stroke as a flat array of `[x, y]`
 * vertices forming a closed polygon. This function encodes that polygon as a
 * smooth SVG cubic bezier path by using each vertex as a quadratic control point
 * and the midpoint between consecutive vertices as the on-curve endpoint —
 * a standard technique for smooth freehand rendering.
 *
 * @param stroke - The array of `[x, y]` outline vertices returned by `getStroke`.
 * @returns A valid SVG path `d` string, or an empty string if the stroke is empty.
 */
export function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) return "";

  // Seed the accumulator with a Move-to at the very first vertex
  const firstPoint = stroke[0]!;
  const initial: (string | number)[] = [
    "M",
    firstPoint[0]!,
    firstPoint[1]!,
    "Q",
  ];

  const d = stroke.reduce<(string | number)[]>((acc, point, index, arr) => {
    const [x0, y0] = point as [number, number];

    // Wrap around so the last point connects smoothly back to the first,
    // closing the filled shape without a hard corner
    const nextPoint = arr[(index + 1) % arr.length]! as [number, number];
    const [x1, y1] = nextPoint;

    // Current vertex is the quadratic control point;
    // the midpoint between this and the next vertex is the on-curve endpoint.
    // This keeps the curve smooth through every sample point.
    acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);

    return acc;
  }, initial);

  // Close the path to fill the stroke outline as a solid shape
  d.push("Z");

  return d.join(" ");
}
