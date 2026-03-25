"use client";

import { memo } from "react";
import type { Camera } from "~/types";
import useSelectionBoxBounds from "~/hooks/useSelectionBoxBounds";
import { BringToFront, SendToBack } from "lucide-react";
import { useMutation } from "@liveblocks/react";

const LayerContextMenu = memo(({ camera }: { camera: Camera }) => {
  const bounds = useSelectionBoxBounds(); // for positioning the context menu relative to the selection box

  if (!bounds) return null;

  // Canvas space point -> screen space point (see screenToCanvas() in utils.ts)
  const x = (bounds.x + bounds.width / 2) * camera.zoom + camera.x;
  const y = bounds.y * camera.zoom + camera.y;

  /*
   * In Liveblocks, the rendering order is determined by the order of IDs in our LiveList (layerIds).
   * The last item in the list is rendered "on top."
   */

  const bringToFront = useMutation(({ self, storage }) => {
    const selections = self.presence.selections; // we need the selection IDs to know what to move

    if (!selections) return;

    const liveLayerIds = storage.get("layerIds");
    const indices: number[] = [];

    // Find current indices of selected layers
    for (let i = 0; i < liveLayerIds.length; i++) {
      if (selections.includes(liveLayerIds.get(i)!)) {
        indices.push(i);
      }
    }

    // Move to front: Iterate backwards and move to target index
    for (
      let i = indices.length - 1, target = liveLayerIds.length - 1;
      i >= 0;
      i--, target--
    ) {
      liveLayerIds.move(indices[i]!, target);
    }
  }, []);

  const sendToBack = useMutation(({ self, storage }) => {
    const selections = self.presence.selections; // we need the selection IDs to know what to move

    if (!selections) return;

    const liveLayerIds = storage.get("layerIds");
    const indices: number[] = [];

    for (let i = 0; i < liveLayerIds.length; i++) {
      if (selections.includes(liveLayerIds.get(i)!)) {
        indices.push(i);
      }
    }

    // Move to back: Iterate forwards and move to index target index
    for (let i = 0, target = 0; i < indices.length; i++, target++) {
      liveLayerIds.move(indices[i]!, target);
    }
  }, []);

  return (
    <div
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,
      }}
      className="absolute flex min-w-37.5 flex-col rounded-xl bg-[#f5f5f5] p-2 text-gray-900 shadow-lg"
    >
      <button
        type="button"
        onClick={bringToFront}
        className="inline-flex w-full items-center gap-2 rounded-md p-1 transition-colors duration-200 hover:bg-blue-500 hover:text-white focus-visible:bg-blue-500 focus-visible:text-white"
      >
        <BringToFront className="size-4" />
        <span className="text-sm">Bring to front</span>
      </button>

      <button
        type="button"
        onClick={sendToBack}
        className="inline-flex w-full items-center gap-2 rounded-md p-1 transition-colors duration-200 hover:bg-blue-500 hover:text-white focus-visible:bg-blue-500 focus-visible:text-white"
      >
        <SendToBack className="size-4" />
        <span className="text-sm">Send to back</span>
      </button>
    </div>
  );
});

LayerContextMenu.displayName = "LayerContextMenu";

export default LayerContextMenu;
