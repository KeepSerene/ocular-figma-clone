import { CanvasMode, LayerType, type CanvasState } from "~/types";
import PointerSelectButton from "./PointerSelectButton";
import ShapeSelectButton from "./ShapeSelectButton";
import ZoomInButton from "./ZoomInButton";
import ZoomOutButton from "./ZoomOutButton";
import PencilButton from "./PencilButton";
import TextButton from "./TextButton";
import UndoButton from "./UndoButton";
import RedoButton from "./RedoButton";

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  canUndo: boolean;
  undo: () => void;
  canRedo: boolean;
  redo: () => void;
  canZoomIn: boolean;
  zoomIn: () => void;
  canZoomOut: boolean;
  zoomOut: () => void;
}

function Toolbar({
  canvasState,
  setCanvasState,
  canUndo,
  undo,
  canRedo,
  redo,
  canZoomIn,
  zoomIn,
  canZoomOut,
  zoomOut,
}: ToolbarProps) {
  return (
    <div className="border-border bg-card fixed bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center rounded-xl border p-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-0.5">
        <PointerSelectButton
          isActive={
            canvasState.mode === CanvasMode.MOVING ||
            canvasState.mode === CanvasMode.PRESSING ||
            canvasState.mode === CanvasMode.DRAGGING ||
            canvasState.mode === CanvasMode.SELECTION_NET ||
            canvasState.mode === CanvasMode.RESIZING ||
            canvasState.mode === CanvasMode.TRANSLATING
          }
          canvasMode={canvasState.mode}
          onClick={(canvasMode) => {
            setCanvasState(
              canvasMode === CanvasMode.DRAGGING
                ? { mode: canvasMode, origin: null }
                : { mode: canvasMode },
            );
          }}
        />

        <ShapeSelectButton
          isActive={
            canvasState.mode === CanvasMode.INSERTING &&
            [LayerType.RECTANGLE, LayerType.ELLIPSE].includes(canvasState.layer)
          }
          canvasState={canvasState}
          onClick={(layer) => {
            setCanvasState({ mode: CanvasMode.INSERTING, layer });
          }}
        />

        <PencilButton
          isActive={canvasState.mode === CanvasMode.PENCIL}
          onClick={() => {
            setCanvasState({ mode: CanvasMode.PENCIL });
          }}
        />

        <TextButton
          isActive={
            canvasState.mode === CanvasMode.INSERTING &&
            canvasState.layer === LayerType.TEXT
          }
          onClick={() => {
            setCanvasState({
              mode: CanvasMode.INSERTING,
              layer: LayerType.TEXT,
            });
          }}
        />

        {/* Separator */}
        <div className="bg-border mx-1 h-5 w-px" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <UndoButton onClick={undo} disabled={!canUndo} />
          <RedoButton onClick={redo} disabled={!canRedo} />
        </div>

        {/* Separator */}
        <div className="bg-border mx-1 h-5 w-px" />

        {/* Zoom */}
        <div className="flex items-center gap-0.5">
          <ZoomOutButton onClick={zoomOut} disabled={!canZoomOut} />
          <ZoomInButton onClick={zoomIn} disabled={!canZoomIn} />
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
