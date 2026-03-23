import { memo } from "react";
import IconButton from "./IconButton";
import { ZoomOut } from "lucide-react";

interface ZoomOutButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const ZoomOutButton = memo(({ onClick, disabled }: ZoomOutButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      ariaLabel="Click to zoom out"
      title="Zoom out"
    >
      <ZoomOut className="size-5 text-[#888888]" />
    </IconButton>
  );
});

ZoomOutButton.displayName = "ZoomOutButton";

export default ZoomOutButton;
