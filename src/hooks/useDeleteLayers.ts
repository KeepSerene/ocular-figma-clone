import { useMutation } from "@liveblocks/react";

export default function useDeleteLayers() {
  return useMutation(({ self, storage, setMyPresence }) => {
    const selections = self.presence.selections;

    if (!selections || selections.length === 0) return;

    const liveLayers = storage.get("layers");
    const liveLayerIds = storage.get("layerIds");

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
  }, []);
}
