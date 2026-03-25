import { shallow, useSelf, useStorage } from "@liveblocks/react";
import type { LiveLayer } from "liveblocks.config";
import type { Box } from "~/types";

/**
 * Computes the tightest axis-aligned bounding box (AABB) that encloses all
 * of the provided layers. Used to position the SelectionBox outline, the
 * dimension label, and the resize handles.
 *
 * @param layers - One or more layers whose individual bounding boxes should
 *   be unioned. The array must be non-empty.
 *
 * @returns A `Box` covering all layers, or `null` if the array is empty.
 */
function getBoundingBox(layers: LiveLayer[]): Box | null {
  const first = layers[0];

  if (!first) return null;

  // Seed the running extremes from the first layer
  let left = first.x;
  let top = first.y;
  let right = first.x + first.width;
  let bottom = first.y + first.height;

  // Expand the bounding box to include every subsequent layer
  for (let i = 1; i < layers.length; i++) {
    const { x, y, width, height } = layers[i]!;

    if (left > x) left = x;
    if (top > y) top = y;
    if (right < x + width) right = x + width;
    if (bottom < y + height) bottom = y + height;
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}

/**
 * Derives a single bounding box that covers all currently selected layers.
 *
 * Works for any selection size — 0 (returns null), 1 (equals the layer's own
 * bounds), or N (union of all N layers' bounds).
 */
export default function useSelectionBoxBounds(): Box | null {
  const selections = useSelf((me) => me.presence.selections);

  return useStorage((root) => {
    if (!selections || selections.length === 0) return null;

    const selectedLayers = selections
      .map((layerId) => root.layers.get(layerId))
      .filter(
        (layer): layer is NonNullable<typeof layer> => layer != null,
      ) as unknown as LiveLayer[];

    return getBoundingBox(selectedLayers);
  }, shallow);
}

/*
 * ### Why `shallow`?
 * `useStorage` re-renders the component whenever its selector returns a new
 * value. `getBoundingBox` always returns a **new object** — even if the
 * numbers inside haven't changed — so without a custom equality function
 * every storage update would trigger a re-render, even when the box is
 * visually identical.
 *
 * `shallow` performs a **one-level property comparison** on the returned
 * object: it checks whether `prev.x === next.x && prev.y === next.y &&
 * prev.width === next.width && prev.height === next.height`. If all four
 * values are the same, React skips the re-render. This is safe here because
 * `Box` is a flat object (no nested references that `shallow` would miss).
 *
 * TL;DR — `shallow` prevents unnecessary re-renders when selected layer
 * positions haven't actually changed.
 */
