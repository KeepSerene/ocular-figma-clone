"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function PasswordInput({
  className,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  return (
    <div className="relative w-full">
      <input
        {...props}
        type={isVisible ? "text" : "password"}
        className={`border-input bg-background text-foreground placeholder:text-muted-foreground/30 focus:border-ring w-full rounded-md border py-2.5 pr-11 pl-3.5 text-sm transition-colors duration-150 focus:outline-none ${className}`}
      />

      {/* Toggle button */}
      <button
        type="button"
        onClick={toggleVisibility}
        aria-label={isVisible ? "Hide password" : "Show password"}
        title={isVisible ? "Hide password" : "Show password"}
        className="text-muted-foreground/50 hover:text-foreground focus-visible:ring-ring/50 absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        {isVisible ? (
          <EyeOff className="size-4" aria-hidden="true" />
        ) : (
          <Eye className="size-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
