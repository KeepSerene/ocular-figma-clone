import { useMutation, useSelf } from "@liveblocks/react";

export default function useDeleteLayers() {
  const selections = useSelf((me) => me.presence.selections);

  return useMutation(
    ({ storage, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const liveLayerIds = storage.get("layerIds");

      if (!selections || selections.length === 0) return;

      // Delete the selected layers and their IDs
      selections.forEach((layerId) => {
        // Delete the layer
        liveLayers.delete(layerId);

        // Delete the layer ID
        const index = liveLayerIds.indexOf(layerId);

        if (index !== -1) liveLayerIds.delete(index);
      });

      // Now that we have deleted the selected layers,
      // update user selections and add it to Liveblocks history
      // for undo & redo operations
      setMyPresence({ selections: [] }, { addToHistory: true });
    },
    [selections],
  );
}
