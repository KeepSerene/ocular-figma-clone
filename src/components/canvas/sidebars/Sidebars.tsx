"use client";

import { memo } from "react";
import { useMutation, useOthers, useSelf, useStorage } from "@liveblocks/react";
import { colorObjToHex, connectionIdToColor, hexToRgb } from "~/lib/utils";
import Link from "next/link";
import { OcularIcon } from "~/components/Logo";
import {
  ALargeSmall,
  ArrowLeftRight,
  ArrowUpDown,
  CircleDashed,
  Ellipse,
  Layers,
  MoveHorizontal,
  MoveVertical,
  Palette,
  PenTool,
  RectangleHorizontal,
  SquareChevronDown,
  SquareChevronUp,
  SquareRoundCorner,
  Text,
} from "lucide-react";
import { LayerType, type Color } from "~/types";
import LayerButton from "./LayerButton";
import NumberInput from "./NumberInput";
import ColorPicker from "./ColorPicker";
import Dropdown from "./Dropdown";
import UserAvatar from "./UserAvatar";
import InviteModal from "./InviteModal";
import type { Invitee } from "~/app/dashboard/designs/[designId]/page";

interface SidebarsProps {
  roomId: string;
  roomTitle: string;
  invitees: Invitee[];
  isLeftCollapsed: boolean;
  setIsLeftCollapsed: (value: boolean) => void;
}

interface LayerUpdateOptions {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  cornerRadius?: number;
  stroke?: string;
  opacity?: number;
}

const Sidebars = memo(
  ({
    roomId,
    roomTitle,
    invitees,
    isLeftCollapsed,
    setIsLeftCollapsed,
  }: SidebarsProps) => {
    const me = useSelf();
    const others = useOthers();

    const selectedLayerId = useSelf((me) => {
      const selections = me.presence.selections;

      return selections.length === 1 ? selections[0] : null;
    });
    const selectedLayer = useStorage((root) => {
      if (!selectedLayerId) return null;

      return root.layers.get(selectedLayerId);
    });
    const canvasColor = useStorage((root) => root.canvasColor);
    const layers = useStorage((root) => root.layers);
    const layerIds = useStorage((root) => root.layerIds);
    const reversedLayerIds = [...(layerIds ?? [])].reverse();
    const selections = useSelf((me) => me.presence.selections);

    const setCanvasColor = useMutation(({ storage }, newColor: Color) => {
      storage.set("canvasColor", newColor);
    }, []);

    const updateLayer = useMutation(
      ({ storage }, options: LayerUpdateOptions) => {
        if (!selectedLayerId) return;

        const liveLayers = storage.get("layers");
        const selectedLayer = liveLayers.get(selectedLayerId);

        if (selectedLayer) {
          selectedLayer.update({
            ...(options.x !== undefined && { x: options.x }),
            ...(options.y !== undefined && { y: options.y }),
            ...(options.width !== undefined && { width: options.width }),
            ...(options.height !== undefined && { height: options.height }),
            ...(options.fill !== undefined && { fill: hexToRgb(options.fill) }),
            ...(options.cornerRadius !== undefined && {
              cornerRadius: options.cornerRadius,
            }),
            ...(options.stroke !== undefined && {
              stroke: hexToRgb(options.stroke),
            }),
            ...(options.fontFamily !== undefined && {
              fontFamily: options.fontFamily,
            }),
            ...(options.fontSize !== undefined && {
              fontSize: options.fontSize,
            }),
            ...(options.fontWeight !== undefined && {
              fontWeight: options.fontWeight,
            }),
            ...(options.opacity !== undefined && { opacity: options.opacity }),
          });
        }
      },
      [selectedLayerId],
    );

    return (
      <>
        {/* Left sidebar */}
        {!isLeftCollapsed ? (
          // Expanded state
          <aside className="fixed left-0 flex h-dvh w-60 flex-col rounded-tr-xl rounded-br-xl border-r border-gray-200 bg-white">
            <section className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <Link href="/dashboard">
                  <OcularIcon size={30} />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsLeftCollapsed(true)}
                  aria-label="Click collapse sidebar"
                  title="Collapse"
                >
                  <SquareChevronUp className="size-5" />
                </button>
              </div>

              <h2 className="mt-2 scroll-m-20 text-[13px] font-medium">
                {roomTitle}
              </h2>
            </section>

            {/* Layers */}
            <ul className="flex flex-col gap-1 p-4">
              <p className="mb-2 flex items-center gap-2">
                <Layers className="size-4" />
                <span className="text-sm font-medium">Layers</span>
              </p>

              {layerIds &&
                layerIds.length > 0 &&
                reversedLayerIds.map((id) => {
                  const layer = layers?.get(id);
                  const isSelected = selections?.includes(id);

                  if (layer?.type === LayerType.RECTANGLE) {
                    return (
                      <li key={id}>
                        <LayerButton
                          layerId={id}
                          isSelected={isSelected ?? false}
                          icon={RectangleHorizontal}
                          label="Rectangle"
                        />
                      </li>
                    );
                  } else if (layer?.type === LayerType.ELLIPSE) {
                    return (
                      <li key={id}>
                        <LayerButton
                          layerId={id}
                          isSelected={isSelected ?? false}
                          icon={Ellipse}
                          label="Ellipse"
                        />
                      </li>
                    );
                  } else if (layer?.type === LayerType.PATH) {
                    return (
                      <li key={id}>
                        <LayerButton
                          layerId={id}
                          isSelected={isSelected ?? false}
                          icon={PenTool}
                          label="Drawing"
                        />
                      </li>
                    );
                  } else if (layer?.type === LayerType.TEXT) {
                    return (
                      <li key={id}>
                        <LayerButton
                          layerId={id}
                          isSelected={isSelected ?? false}
                          icon={Text}
                          label="Text"
                        />
                      </li>
                    );
                  }
                })}
            </ul>
          </aside>
        ) : (
          // Collapsed state
          <section className="fixed top-3 left-3 flex h-12 w-62.5 items-center justify-between rounded-xl border bg-white p-4">
            <Link href="/dashboard">
              <OcularIcon size={30} />
            </Link>

            <h2 className="scroll-m-20 text-[13px] font-medium">{roomTitle}</h2>

            <button
              type="button"
              onClick={() => setIsLeftCollapsed(false)}
              aria-label="Click to expand sidebar"
              title="Expand"
            >
              <SquareChevronDown className="size-5" />
            </button>
          </section>
        )}

        {/* Right sidebar */}
        {!isLeftCollapsed || selectedLayer ? (
          <aside
            className={`fixed ${isLeftCollapsed && selectedLayer ? "top-3 right-3 bottom-3 rounded-xl" : ""} ${!isLeftCollapsed && !selectedLayer ? "h-dvh rounded-tl-xl rounded-bl-xl" : ""} ${!isLeftCollapsed && selectedLayer ? "top-0 bottom-0 h-dvh rounded-tl-xl rounded-bl-xl" : ""} right-0 flex w-60 flex-col border-l border-gray-200 bg-white`}
          >
            {/* User avatars + Share button */}
            <div className="flex items-center justify-between gap-2 p-3">
              <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-scroll text-xs">
                {/* My avatar */}
                {me && (
                  <UserAvatar
                    isSelf={true}
                    color={connectionIdToColor(me.connectionId)}
                    name={me.info.name}
                  />
                )}

                {/* Others' avatars */}
                {others.map((other) => (
                  <UserAvatar
                    key={other.connectionId}
                    color={connectionIdToColor(other.connectionId)}
                    name={other.info.name}
                  />
                ))}
              </div>

              <InviteModal roomId={roomId} invitees={invitees} />
            </div>

            {/* Separator */}
            <div className="border-b border-gray-200" />

            {selectedLayer ? (
              <>
                {/* ==== Position ==== */}
                <div className="flex flex-col gap-1 p-4">
                  <span className="text-xs font-medium">Position</span>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-medium text-gray-500">
                      Coordinates
                    </span>

                    <div className="flex w-full items-center gap-2">
                      {/* x */}
                      <NumberInput
                        value={selectedLayer.x}
                        onChange={(val) => {
                          updateLayer({ x: val });
                        }}
                        icon={MoveHorizontal}
                        className="w-1/2"
                      />

                      {/* y */}
                      <NumberInput
                        value={selectedLayer.y}
                        onChange={(val) => {
                          updateLayer({ y: val });
                        }}
                        icon={MoveVertical}
                        className="w-1/2"
                      />
                    </div>
                  </div>
                </div>

                {selectedLayer.type !== LayerType.PATH && (
                  <>
                    {/* Separator */}
                    <div className="border-b border-gray-200" />

                    {/* ==== Layout ==== */}
                    <div className="flex flex-col gap-1 p-4">
                      <span className="text-xs font-medium">Layout</span>

                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-medium text-gray-500">
                          Dimensions
                        </span>

                        <div className="flex w-full items-center gap-2">
                          {/* width */}
                          <NumberInput
                            value={selectedLayer.width}
                            onChange={(val) => {
                              updateLayer({ width: val });
                            }}
                            icon={ArrowLeftRight}
                            className="w-1/2"
                          />

                          {/* height */}
                          <NumberInput
                            value={selectedLayer.height}
                            onChange={(val) => {
                              updateLayer({ height: val });
                            }}
                            icon={ArrowUpDown}
                            className="w-1/2"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Separator */}
                <div className="border-b border-gray-200" />

                {/* ==== Appearance ==== */}
                <div className="flex flex-col gap-1 p-4">
                  <span className="text-xs font-medium">Appearance</span>

                  <div className="flex w-full items-center gap-2">
                    <div className="flex w-1/2 flex-col gap-1">
                      <span className="text-[10px] font-medium text-gray-500">
                        Opacity
                      </span>

                      {/* opacity */}
                      <NumberInput
                        min={0}
                        max={1}
                        value={selectedLayer.opacity}
                        onChange={(val) => {
                          updateLayer({ opacity: val });
                        }}
                        icon={CircleDashed}
                        className="w-full"
                      />
                    </div>

                    {selectedLayer.type === LayerType.RECTANGLE && (
                      <div className="flex w-1/2 flex-col gap-1">
                        <span className="text-[10px] font-medium text-gray-500">
                          Corner Radius
                        </span>

                        {/* corner radius */}
                        <NumberInput
                          min={0}
                          max={
                            Math.min(
                              selectedLayer.width,
                              selectedLayer.height,
                            ) / 2
                          }
                          value={selectedLayer.cornerRadius ?? 0}
                          onChange={(val) => {
                            updateLayer({ cornerRadius: val });
                          }}
                          icon={SquareRoundCorner}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Separator */}
                <div className="border-b border-gray-200" />

                {/* ==== Fill ==== */}
                <div className="flex flex-col gap-1 p-4">
                  <span className="text-[10px] font-medium text-gray-500">
                    Fill
                  </span>

                  <ColorPicker
                    color={colorObjToHex(selectedLayer.fill)}
                    onChange={(color) => {
                      updateLayer({ fill: color });
                    }}
                  />
                </div>

                {/* Separator */}
                <div className="border-b border-gray-200" />

                {/* ==== Stroke ==== */}
                <div className="flex flex-col gap-1 p-4">
                  <span className="text-[10px] font-medium text-gray-500">
                    Stroke
                  </span>

                  <ColorPicker
                    color={colorObjToHex(selectedLayer.stroke)}
                    onChange={(color) => {
                      updateLayer({ stroke: color });
                    }}
                  />

                  {/* ==== Typography ==== */}
                </div>

                {selectedLayer.type === LayerType.TEXT && (
                  <>
                    {/* Separator */}
                    <div className="border-b border-gray-200" />

                    {/* ==== Typography ==== */}
                    <div className="flex flex-col gap-1 p-4">
                      <span className="text-[10px] font-medium text-gray-500">
                        Typography
                      </span>

                      <div className="flex flex-col gap-2">
                        {/* ==== Font family ==== */}
                        <Dropdown
                          value={selectedLayer.fontFamily}
                          onChange={(value) => {
                            updateLayer({ fontFamily: value });
                          }}
                          options={["Inter", "Arial", "Times New Roman"]}
                        />

                        <div className="flex w-full items-center gap-2">
                          {/* ==== Font size ==== */}
                          <div className="flex w-full flex-col gap-1">
                            <span className="text-[10px] font-medium text-gray-500">
                              Size
                            </span>

                            <NumberInput
                              value={selectedLayer.fontSize}
                              onChange={(value) => {
                                updateLayer({ fontSize: value });
                              }}
                              icon={ALargeSmall}
                              className="w-full"
                            />
                          </div>

                          {/* ==== Font weight ==== */}
                          <div className="flex w-full flex-col gap-1">
                            <span className="text-[10px] font-medium text-gray-500">
                              Weight
                            </span>

                            <Dropdown
                              value={selectedLayer.fontWeight.toString()}
                              onChange={(value) => {
                                updateLayer({ fontWeight: +value });
                              }}
                              options={[
                                "100",
                                "200",
                                "300",
                                "400",
                                "500",
                                "600",
                                "700",
                                "800",
                                "900",
                              ]}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              // Canvas color
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center gap-1 text-gray-500">
                  <Palette className="size-4" />
                  <span className="text-xs font-medium">Canvas</span>
                </div>

                <ColorPicker
                  color={canvasColor ? colorObjToHex(canvasColor) : "#1e1e1e"}
                  onChange={(color) => {
                    const rgbColor = hexToRgb(color);
                    setCanvasColor(rgbColor ?? { r: 30, g: 30, b: 30 });
                  }}
                />
              </div>
            )}
          </aside>
        ) : (
          // Collapsed state
          <div className="fixed top-3 right-3 flex h-12 w-62.5 items-center justify-between gap-2 rounded-xl border bg-white p-3">
            <div className="flex w-full items-center justify-between gap-2">
              <div className="no-scrollbar flex w-full items-center gap-2 overflow-x-scroll text-xs">
                {/* My avatar */}
                {me && (
                  <UserAvatar
                    isSelf={true}
                    color={connectionIdToColor(me.connectionId)}
                    name={me.info.name}
                  />
                )}

                {/* Others' avatars */}
                {others.map((other) => (
                  <UserAvatar
                    key={other.connectionId}
                    color={connectionIdToColor(other.connectionId)}
                    name={other.info.name}
                  />
                ))}
              </div>

              <InviteModal roomId={roomId} invitees={invitees} />
            </div>
          </div>
        )}
      </>
    );
  },
);

Sidebars.displayName = "Sidebars";

export default Sidebars;
