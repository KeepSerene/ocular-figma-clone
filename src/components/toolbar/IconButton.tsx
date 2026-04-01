"use client";

interface IconButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  title?: string;
}

const IconButton = ({
  onClick,
  children,
  isActive = false,
  disabled = false,
  ariaLabel = "",
  title = "",
}: IconButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    title={title}
    aria-pressed={isActive}
    aria-disabled={disabled}
    className={`focus-visible:ring-ring focus-visible:ring-offset-card flex size-8 items-center justify-center rounded-lg text-sm transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 ${
      isActive
        ? "bg-primary/15 text-primary"
        : "text-muted-foreground hover:bg-accent hover:text-foreground"
    } `}
  >
    {children}
  </button>
);

export default IconButton;
