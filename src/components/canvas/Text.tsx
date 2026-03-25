"use client";

import type { Color, TextLayer } from "~/types";
import { memo, useEffect, useRef, useState } from "react";
import { colorObjToHex } from "~/lib/utils";
import { useMutation } from "@liveblocks/react";

const getHexColor = (colorObj: Color) =>
  colorObj ? colorObjToHex(colorObj) : "#ccc";

interface TextProps {
  id: string;
  layer: TextLayer;
  onLayerPointerDown: (layerId: string, event: React.PointerEvent) => void;
}

const Text = memo(({ id, layer, onLayerPointerDown }: TextProps) => {
  const {
    x,
    y,
    width,
    height,
    fontFamily,
    fontSize,
    fontWeight,
    text,
    fill,
    stroke,
    opacity,
  } = layer;

  const [isEditing, setIsEditing] = useState(false);
  const [userText, setUserText] = useState(text);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserText(event.target.value);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  // Save text to Liveblocks storage
  const saveText = useMutation(
    ({ storage }, newText: string) => {
      const liveLayers = storage.get("layers");
      const layer = liveLayers.get(id);

      if (layer) {
        layer.update({ text: newText });
      }
    },
    [id],
  );

  const commitEdit = () => {
    const trimmed = userText.trim();

    if (trimmed === "") {
      // Discard the edit and revert to whatever was last saved
      setUserText(text);
    } else {
      saveText(trimmed);
    }

    setIsEditing(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") commitEdit();
  };

  const handleBlur = () => commitEdit();

  // Focus input on double click
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <g onDoubleClick={handleDoubleClick} className="group">
      {isEditing ? (
        <foreignObject x={x} y={y} width={width} height={height}>
          <input
            ref={inputRef}
            type="text"
            value={userText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              color: getHexColor(fill),
              fontFamily:
                fontFamily === "Inter"
                  ? "var(--font-inter), Inter, sans-serif"
                  : fontFamily,
              fontSize,
              border: "none",
              outline: "none",
            }}
          />
        </foreignObject>
      ) : (
        <>
          {/* Hover border */}
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            fill="none"
            stroke="#0b99ff"
            strokeWidth={2}
            className="pointer-events-none opacity-0 group-hover:opacity-100"
          />

          {/* Main text */}
          <text
            x={x}
            y={y + fontSize}
            width={width}
            height={height}
            fontFamily={
              fontFamily === "Inter"
                ? "var(--font-inter), Inter, sans-serif"
                : fontFamily
            }
            fontSize={fontSize}
            fontWeight={fontWeight}
            fill={getHexColor(fill)}
            stroke={getHexColor(stroke)}
            opacity={opacity}
            onPointerDown={(event) => onLayerPointerDown(id, event)}
          >
            {text}
          </text>
        </>
      )}
    </g>
  );
});

Text.displayName = "Text";

export default Text;
