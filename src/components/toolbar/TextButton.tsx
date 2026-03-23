import { memo } from "react";
import IconButton from "./IconButton";
import { Type } from "lucide-react";

interface TextButtonProps {
  isActive: boolean;
  onClick: () => void;
}

const TextButton = memo(({ isActive, onClick }: TextButtonProps) => {
  return (
    <IconButton
      isActive={isActive}
      onClick={onClick}
      ariaLabel="Click to insert text"
      title="Text"
    >
      <Type className="size-5" />
    </IconButton>
  );
});

TextButton.displayName = "TextButton";

export default TextButton;
