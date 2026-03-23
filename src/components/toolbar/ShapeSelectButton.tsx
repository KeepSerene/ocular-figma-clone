import { memo, useEffect, useRef, useState } from "react";
import { CanvasMode, LayerType, type CanvasState } from "~/types";
import IconButton from "./IconButton";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Ellipse,
  RectangleHorizontal,
} from "lucide-react";

interface ShapeSelectButtonProps {
  isActive: boolean;
  canvasState: CanvasState;
  onClick: (layer: LayerType.RECTANGLE | LayerType.ELLIPSE) => void;
}

const ShapeSelectButton = memo(
  ({ isActive, canvasState, onClick }: ShapeSelectButtonProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuParentRef = useRef<HTMLDivElement>(null);

    const isInsertingShape =
      canvasState.mode === CanvasMode.INSERTING &&
      canvasState.layer !== LayerType.TEXT;
    const isRectangle =
      isInsertingShape && canvasState.layer === LayerType.RECTANGLE;
    const isEllipse =
      isInsertingShape &&
      !isRectangle &&
      canvasState.layer === LayerType.ELLIPSE;

    const handleMenuItemClick = (
      layer: LayerType.RECTANGLE | LayerType.ELLIPSE,
    ) => {
      onClick(layer);
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
          onClick={() => onClick(LayerType.RECTANGLE)}
          ariaLabel={
            !isInsertingShape
              ? "Insert Rectangle"
              : isRectangle
                ? "Insert rectangle"
                : "Insert ellipse"
          }
          title={
            !isInsertingShape
              ? "Rectangle"
              : isRectangle
                ? "Rectangle"
                : "Ellipse"
          }
        >
          {/* Default shape: rectangle */}
          {!isInsertingShape && <RectangleHorizontal className="size-5" />}
          {isInsertingShape && isRectangle && (
            <RectangleHorizontal className="size-5" />
          )}
          {isInsertingShape && isEllipse && <Ellipse className="size-5" />}
        </IconButton>

        {/* Menu toggler button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={`Click to ${isOpen ? "close" : "open"} shapes menu`}
          title={`${isOpen ? "Close" : "Open"} shapes menu`}
        >
          {isOpen ? (
            <ChevronDown className="size-3" />
          ) : (
            <ChevronUp className="size-3" />
          )}
        </button>

        {/* Shapes selection menu */}
        {isOpen && (
          <div className="absolute -top-20 min-w-37.5 rounded-xl bg-[#f5f5f5] p-2 text-gray-900 shadow-lg">
            <button
              type="button"
              onClick={() => handleMenuItemClick(LayerType.RECTANGLE)}
              className={`inline-flex w-full items-center justify-between gap-3 rounded-md p-1 transition-colors hover:bg-blue-500 hover:text-white focus-visible:bg-blue-500 focus-visible:text-white ${isRectangle ? "bg-blue-500 text-white" : ""}`}
            >
              <span className="inline-flex items-center gap-1">
                <RectangleHorizontal className="size-4" />
                <span className="text-xs">Rectangle</span>
              </span>

              {isRectangle && <Check className="size-4" />}
            </button>

            <button
              type="button"
              onClick={() => handleMenuItemClick(LayerType.ELLIPSE)}
              className={`inline-flex w-full items-center justify-between gap-3 rounded-md p-1 transition-colors hover:bg-blue-500 hover:text-white focus-visible:bg-blue-500 focus-visible:text-white ${isEllipse ? "bg-blue-500 text-white" : ""}`}
            >
              <span className="inline-flex items-center gap-1">
                <Ellipse className="size-4" />
                <span className="text-xs">Ellipse</span>
              </span>

              {isEllipse && <Check className="size-4" />}
            </button>
          </div>
        )}
      </div>
    );
  },
);

ShapeSelectButton.displayName = "ShapeSelectButton";

export default ShapeSelectButton;
