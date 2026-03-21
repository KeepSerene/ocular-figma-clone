"use client";

import { CanvasMode } from "~/types";
import { memo, useEffect, useRef, useState } from "react";
import IconButton from "./IconButton";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Hand,
  MousePointer2,
} from "lucide-react";

interface PointerSelectButtonProps {
  isActive: boolean;
  canvasMode: CanvasMode;
  onClick: (mode: CanvasMode.MOVING | CanvasMode.DRAGGING) => void;
}

const PointerSelectButton = memo(
  ({ isActive, canvasMode, onClick }: PointerSelectButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuParentRef = useRef<HTMLDivElement>(null);

    const isMoving = canvasMode === CanvasMode.MOVING;
    const isDragging = canvasMode === CanvasMode.DRAGGING;

    const handleMenuItemClick = (
      mode: CanvasMode.MOVING | CanvasMode.DRAGGING,
    ) => {
      onClick(mode);
      setIsOpen(false);
    };

    // Close selection menu when clicked outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuParentRef.current &&
          !menuParentRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div ref={menuParentRef} className="relative flex items-center gap-1">
        <IconButton
          isActive={isActive}
          onClick={() => onClick(CanvasMode.MOVING)}
          ariaLabel={isMoving ? "Move" : isDragging ? "Drag" : "Move"}
          title={isMoving ? "Move" : isDragging ? "Drag" : "Move"}
        >
          {/* Default option */}
          {!isMoving && !isDragging && <MousePointer2 className="size-5" />}
          {isMoving && <MousePointer2 className="size-5" />}
          {isDragging && <Hand className="size-5" />}
        </IconButton>

        {/* Menu toggler button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Click to toggle pointers menu"
          title="Toggle pointers menu"
        >
          {isOpen ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronUp className="size-3" />
          )}
        </button>

        {/* Selection menu */}
        {isOpen && (
          <div className="absolute -top-20 min-w-37.5 rounded-xl bg-[#f5f5f5] p-2 text-gray-900 shadow-lg">
            <button
              type="button"
              onClick={() => handleMenuItemClick(CanvasMode.MOVING)}
              className={`inline-flex w-full items-center justify-between gap-3 rounded-md p-1 transition-colors hover:bg-blue-500 hover:text-white focus-visible:bg-blue-500 focus-visible:text-white ${isMoving ? "bg-blue-500 text-white" : ""}`}
            >
              <span className="inline-flex items-center gap-1">
                <MousePointer2 className="size-4" />
                <span className="text-xs">Move</span>
              </span>

              {isMoving && <Check className="size-4" />}
            </button>

            <button
              type="button"
              onClick={() => handleMenuItemClick(CanvasMode.DRAGGING)}
              className={`inline-flex w-full items-center justify-between gap-3 rounded-md p-1 transition-colors hover:bg-blue-500 hover:text-white focus-visible:bg-blue-500 focus-visible:text-white ${isDragging ? "bg-blue-500 text-white" : ""}`}
            >
              <span className="inline-flex items-center gap-1">
                <Hand className="size-4" />
                <span className="text-xs">Drag</span>
              </span>

              {isDragging && <Check className="size-4" />}
            </button>
          </div>
        )}
      </div>
    );
  },
);

PointerSelectButton.displayName = "PointerSelectButton";

export default PointerSelectButton;
