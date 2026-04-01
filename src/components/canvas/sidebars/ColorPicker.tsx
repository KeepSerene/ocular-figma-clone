"use client";

import { memo, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void; // save changes to Liveblocks
  className?: string;
}

const ColorPicker = memo(({ color, onChange, className }: ColorPickerProps) => {
  const [usersPick, setUsersPick] = useState(color);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerPos, setPickerPos] = useState({ top: 0, left: 0 });

  // Refs for click-outside detection across portal boundary
  const swatchRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  // Sync if external color changes (e.g. another user edits)
  useEffect(() => {
    setUsersPick(color);
  }, [color]);

  // Close picker on outside click — must check both the input container
  // AND the floating portal element since they're in different DOM trees
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideContainer = containerRef.current?.contains(target);
      const insideFloating = floatingRef.current?.contains(target);

      if (!insideContainer && !insideFloating) {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);

    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  const handleSwatchClick = () => {
    if (!isPickerOpen && swatchRef.current) {
      const rect = swatchRef.current.getBoundingClientRect();

      // Picker is ~200px wide, ~200px tall (react-colorful default).
      // Position it to the LEFT of the swatch, clamped to viewport.
      const PICKER_W = 204;
      const PICKER_H = 220;

      const rawLeft = rect.left - PICKER_W - 8;
      const rawTop = rect.top;

      setPickerPos({
        // Never clip off left or right edge
        left: Math.max(8, Math.min(rawLeft, window.innerWidth - PICKER_W - 8)),
        // Never clip off bottom edge
        top: Math.max(8, Math.min(rawTop, window.innerHeight - PICKER_H - 8)),
      });
    }
    setIsPickerOpen((prev) => !prev);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsersPick(e.target.value);
  };

  const commitChange = () => {
    if (/^#[0-9a-f]{6}$/i.test(usersPick)) {
      onChange(usersPick);
    } else {
      setUsersPick(color);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      (event.currentTarget as HTMLInputElement).blur();
    }
  };

  const handlePickerChange = (hex: string) => {
    setUsersPick(hex);
    onChange(hex);
  };

  return (
    <div
      ref={containerRef}
      className={`relative h-fit ${className ?? "w-full max-w-32"}`}
    >
      {/* Color swatch toggle */}
      <button
        ref={swatchRef}
        type="button"
        onClick={handleSwatchClick}
        aria-label="Choose color"
        title="Pick color"
        className="border-primary/40 absolute top-1/2 left-2 size-4 -translate-y-1/2 rounded-sm border shadow-sm transition-transform duration-100 hover:scale-110"
        style={{ backgroundColor: usersPick }}
      />

      {/* Hex text input */}
      <input
        type="text"
        value={usersPick}
        onChange={handleTextChange}
        onBlur={commitChange}
        onKeyDown={handleKeyDown}
        aria-label="Enter hex color"
        placeholder="#d9d9d9"
        className="border-input bg-muted text-foreground hover:border-border/80 focus:border-ring h-8 w-full rounded-md border pr-2 pl-8 font-mono text-xs transition-colors duration-150 outline-none"
      />

      {/* Floating picker — rendered in <body> via portal to escape any
          ancestor overflow:hidden / overflow:auto clipping */}
      {isPickerOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={floatingRef}
            style={{ top: pickerPos.top, left: pickerPos.left }}
            className="fixed z-9999 shadow-2xl"
          >
            <HexColorPicker color={usersPick} onChange={handlePickerChange} />
          </div>,
          document.body,
        )}
    </div>
  );
});

ColorPicker.displayName = "ColorPicker";

export default ColorPicker;
