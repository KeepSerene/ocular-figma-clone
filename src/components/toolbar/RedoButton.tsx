import { memo } from "react";
import IconButton from "./IconButton";
import { Redo2 } from "lucide-react";

interface RedoButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const RedoButton = memo(({ onClick, disabled }: RedoButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      ariaLabel="Click to redo last action"
      title="Redo"
    >
      <Redo2 className="size-5 text-[#888888]" />
    </IconButton>
  );
});

RedoButton.displayName = "RedoButton";

export default RedoButton;
