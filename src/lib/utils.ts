import type { Camera, Color, Point } from "~/types";

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
