"use client";

import { memo, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

interface NumberInputProps {
  min?: number;
  max?: number;
  value: number;
  onChange: (value: number) => void; // save changes to Liveblocks
  icon: LucideIcon;
  className?: string;
}

const NumberInput = memo(
  ({
    min,
    max,
    value,
    onChange,
    icon: InputIcon,
    className,
  }: NumberInputProps) => {
    const [userInput, setUserInput] = useState(value.toString());

    useEffect(() => {
      setUserInput(value.toString());
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserInput(event.target.value);
    };

    const commitUserInput = () => {
      const newValue = parseFloat(userInput);

      if (isNaN(newValue)) {
        setUserInput(value.toString());
        return;
      }

      const clamped = Math.min(
        max ?? newValue,
        Math.max(min ?? newValue, newValue),
      );
      setUserInput(clamped.toString());
      onChange(clamped);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        (event.currentTarget as HTMLInputElement).blur();
      }
    };

    return (
      <div className={`relative h-fit ${className ?? "w-28"}`}>
        <InputIcon className="text-muted-foreground/60 pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2" />

        <input
          type="number"
          value={userInput}
          onChange={handleChange}
          onBlur={commitUserInput}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          aria-label="Enter apt value"
          placeholder="0"
          className="border-input bg-muted text-foreground hover:border-border/80 focus:border-ring h-8 w-full rounded-md border pr-2 pl-6 text-xs transition-colors duration-150 outline-none"
        />
      </div>
    );
  },
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
