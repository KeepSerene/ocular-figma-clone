"use client";

import { memo, useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void; // save changes to Liveblocks
  className?: string;
}

const ColorPicker = memo(({ color, onChange, className }: ColorPickerProps) => {
  const [userPick, setUserPick] = useState(color);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const pickerParentRef = useRef<HTMLDivElement>(null);

  // Set color as user picks one (instant UI updates)
  useEffect(() => {
    setUserPick(color);
  }, [color, setUserPick]);

  // Close color picker when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerParentRef.current &&
        !pickerParentRef.current.contains(event.target as Node)
      ) {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsPickerOpen]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserPick(event.target.value);
  };

  const commitChange = () => {
    if (/^#[0-9a-f]{6}$/i.test(userPick)) {
      // If a valid hex color string
      onChange(userPick);
    } else {
      setUserPick(color);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      (event.currentTarget as HTMLInputElement).blur(); // triggers commitChange()
    }
  };

  const onHexColorChange = (colorStr: string) => {
    setUserPick(colorStr);
    onChange(colorStr);
  };

  return (
    <div
      ref={pickerParentRef}
      className={`relative h-fit ${className ?? "w-28"}`}
    >
      <input
        type="text"
        value={userPick}
        onChange={handleChange}
        onBlur={commitChange}
        onKeyDown={handleKeyDown}
        placeholder="#d9d9d9"
        className={`h-fit w-full rounded-lg border-2 border-[#f5f5f5] bg-[#f5f5f5] px-2 py-1 pl-6 text-xs transition-colors duration-200 outline-none hover:border-[#e8e8e8] focus:border-blue-600`}
      />

      <button
        type="button"
        onClick={() => setIsPickerOpen(!isPickerOpen)}
        aria-label="Click to choose color"
        title="Color"
        style={{ backgroundColor: userPick }}
        className="absolute top-1/2 left-1.5 size-3.5 -translate-y-1/2"
      />

      {/* Color picker */}
      {isPickerOpen && (
        <div className="absolute right-0 z-10 mt-2 -translate-x-31.25">
          <HexColorPicker color={userPick} onChange={onHexColorChange} />
        </div>
      )}
    </div>
  );
});

ColorPicker.displayName = "ColorPicker";

export default ColorPicker;
