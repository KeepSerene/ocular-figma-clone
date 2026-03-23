import { memo } from "react";
import IconButton from "./IconButton";
import { ZoomIn } from "lucide-react";

interface ZoomInButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const ZoomInButton = memo(({ onClick, disabled }: ZoomInButtonProps) => {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      ariaLabel="Click to zoom in"
      title="Zoom in"
    >
      <ZoomIn className="size-5 text-[#888888]" />
    </IconButton>
  );
});

ZoomInButton.displayName = "ZoomInButton";

export default ZoomInButton;
