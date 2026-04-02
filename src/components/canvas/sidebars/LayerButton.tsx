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
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors duration-100 focus-visible:outline-none ${
          isSelected
            ? "bg-primary/15 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:bg-accent focus-visible:text-foreground"
        } `}
      >
        <ButtonIcon
          className={`size-3.5 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
        />

        <span className="truncate">{label}</span>
      </button>
    );
  },
);

LayerButton.displayName = "LayerButton";

export default LayerButton;
