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
    }, [setIsOpen]);

    return (
      <div ref={menuParentRef} className="relative flex items-center gap-1">
        <IconButton
          isActive={isActive}
          onClick={() => onClick(CanvasMode.MOVING)}
          ariaLabel={isMoving ? "Move" : isDragging ? "Drag" : "Move"}
          title={isMoving ? "Move" : isDragging ? "Drag" : "Move"}
        >
          {/* Default pointer: move */}
          {!isMoving && !isDragging && <MousePointer2 className="size-5" />}
          {isMoving && <MousePointer2 className="size-5" />}
          {isDragging && <Hand className="size-5" />}
        </IconButton>

        {/* Menu toggler button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={`Click to ${isOpen ? "close" : "open"} pointers menu`}
          title={`${isOpen ? "Close" : "Open"} pointers menu`}
        >
          {isOpen ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronUp className="size-3" />
          )}
        </button>

        {/* Pointers selection menu */}
        {isOpen && (
          <div className="bg-muted text-muted-foreground absolute -top-20 min-w-37.5 rounded-md p-2 shadow-lg">
            <button
              type="button"
              onClick={() => handleMenuItemClick(CanvasMode.MOVING)}
              className={`hover:bg-primary/15 hover:text-primary focus-visible:bg-primary/15 focus-visible:text-primary inline-flex w-full items-center justify-between gap-3 rounded p-1 transition-colors duration-150 ${isMoving ? "bg-primary/15 text-primary" : ""}`}
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
              className={`hover:bg-primary/15 hover:text-primary focus-visible:bg-primary/15 focus-visible:text-primary inline-flex w-full items-center justify-between gap-3 rounded p-1 transition-colors duration-150 ${isDragging ? "bg-primary/15 text-primary" : ""}`}
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
