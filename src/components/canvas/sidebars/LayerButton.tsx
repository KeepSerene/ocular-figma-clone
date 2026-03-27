"use client";

import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { useMutation } from "@liveblocks/react";

interface LayerButtonProps {
  layerId: string;
  isSelected: boolean;
  icon: LucideIcon;
  label: string;
}

const LayerButton = memo(
  ({ layerId, isSelected, icon: ButtonIcon, label }: LayerButtonProps) => {
    // Select the layer user clicks on in the left sidebar
    const updateSelection = useMutation(
      ({ setMyPresence }, layerId: string) => {
        setMyPresence({ selections: [layerId] }, { addToHistory: true });
      },
      [],
    );

    return (
      <button
        type="button"
        onClick={() => updateSelection(layerId)}
        className={`flex w-full items-center gap-2 rounded px-1.5 py-1 text-left transition-colors duration-200 hover:bg-gray-100 focus-visible:bg-gray-100 ${isSelected ? "bg-[#bce3ff]" : ""}`}
      >
        <ButtonIcon className="size-4 text-gray-500" />

        <span className="text-sm">{label}</span>
      </button>
    );
  },
);

LayerButton.displayName = "LayerButton";

export default LayerButton;
