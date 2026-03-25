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
    <div className="fixed bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center justify-center rounded-lg bg-white p-1 shadow-[0_0_3px_0_rgba(0,0,0,0.18)]">
      <div className="flex items-center justify-center gap-3">
        <PointerSelectButton
          isActive={
            canvasState.mode === CanvasMode.MOVING ||
            canvasState.mode === CanvasMode.DRAGGING
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
        <div className="w-px self-stretch bg-black/15" />

        {/* Undo & redo buttons */}
        <div className="flex items-center justify-center">
          <UndoButton onClick={undo} disabled={!canUndo} />
          <RedoButton onClick={redo} disabled={!canRedo} />
        </div>

        {/* Separator */}
        <div className="w-px self-stretch bg-black/15" />

        {/* Zoom in & out buttons */}
        <div className="flex items-center justify-center">
          <ZoomInButton onClick={zoomIn} disabled={!canZoomIn} />
          <ZoomOutButton onClick={zoomOut} disabled={!canZoomOut} />
        </div>
      </div>
    </div>
  );
}

export default Toolbar;
