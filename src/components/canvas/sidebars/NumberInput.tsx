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

    // Set values live as user changes size and position of layers on the canvas (instant UI updates)
    useEffect(() => {
      setUserInput(value.toString());
    }, [value, setUserInput]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserInput(event.target.value);
    };

    const commitUserInput = () => {
      const newValue = parseFloat(userInput);

      if (isNaN(newValue)) {
        // Reset
        setUserInput(value.toString());
        return;
      }

      const clampedVal = Math.min(
        max ?? newValue,
        Math.max(min ?? newValue, newValue),
      );
      setUserInput(clampedVal.toString());
      onChange(clampedVal);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        commitUserInput();
        (event.currentTarget as HTMLInputElement).blur();
      }
    };

    return (
      <div className={`relative h-fit ${className ?? "w-28"}`}>
        <InputIcon className="absolute top-1/2 left-1.5 size-4 -translate-y-1/2 text-gray-400" />

        <input
          type="number"
          value={userInput}
          onChange={handleChange}
          onBlur={commitUserInput}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          placeholder="0"
          className={`h-fit w-full rounded-lg border-2 border-[#f5f5f5] bg-[#f5f5f5] px-2 py-1 pl-6 text-xs transition-colors duration-200 outline-none hover:border-[#e8e8e8] focus:border-blue-600`}
        />
      </div>
    );
  },
);

NumberInput.displayName = "NumberInput";

export default NumberInput;
