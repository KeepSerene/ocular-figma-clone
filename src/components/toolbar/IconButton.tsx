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
    className={`flex min-h-7 min-w-7 items-center justify-center rounded-md text-gray-500 transition-colors focus-visible:outline-none hover:enabled:text-gray-700 focus-visible:enabled:text-gray-700 disabled:opacity-50 ${isActive ? "bg-blue-100 text-blue-700! hover:enabled:text-blue-700 focus-visible:enabled:text-blue-700" : ""}`}
  >
    {children}
  </button>
);

export default IconButton;
