import { CanvasMode, LayerType, type CanvasState } from "~/types";
import PointerSelectButton from "./PointerSelectButton";
import ShapeSelectButton from "./ShapeSelectButton";

interface LayerToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
}

function Toolbar({ canvasState, setCanvasState }: LayerToolbarProps) {
  return (
    <div className="fixed bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-lg bg-white p-1 shadow-[0_0_3px_0_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-center gap-3">
        <PointerSelectButton
          isActive={
            canvasState.mode === CanvasMode.MOVING ||
            canvasState.mode === CanvasMode.DRAGGING
          }
          canvasMode={canvasState.mode}
          onClick={(canvasMode) =>
            setCanvasState(
              canvasMode === CanvasMode.DRAGGING
                ? { mode: canvasMode, origin: null }
                : { mode: canvasMode },
            )
          }
        />

        <ShapeSelectButton
          isActive={
            canvasState.mode === CanvasMode.INSERTING &&
            [LayerType.RECTANGLE, LayerType.ELLIPSE].includes(canvasState.layer)
          }
          canvasState={canvasState}
          onClick={(layer) =>
            setCanvasState({ mode: CanvasMode.INSERTING, layer })
          }
        />
      </div>
    </div>
  );
}

export default Toolbar;
