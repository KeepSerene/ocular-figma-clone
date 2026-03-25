import { memo } from "react";
import IconButton from "./IconButton";
import { Undo2 } from "lucide-react";

interface UndoButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const UndoButton = memo(({ onClick, disabled }: UndoButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      ariaLabel="Click to undo last action"
      title="Undo"
    >
      <Undo2 className="size-5 text-[#888888]" />
    </IconButton>
  );
});

UndoButton.displayName = "UndoButton";

export default UndoButton;
