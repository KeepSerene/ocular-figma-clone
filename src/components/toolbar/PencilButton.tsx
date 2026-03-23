import { memo } from "react";
import IconButton from "./IconButton";
import { Pencil } from "lucide-react";

interface PencilButtonProps {
  isActive: boolean;
  onClick: () => void;
}

const PencilButton = memo(({ isActive, onClick }: PencilButtonProps) => {
  return (
    <IconButton
      isActive={isActive}
      onClick={onClick}
      ariaLabel="Click to draw"
      title="Draw"
    >
      <Pencil className="size-5" />
    </IconButton>
  );
});

PencilButton.displayName = "PencilButton";

export default PencilButton;
