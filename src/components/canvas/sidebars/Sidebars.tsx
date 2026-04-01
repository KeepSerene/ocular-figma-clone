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
  PanelLeftClose,
  PanelLeftOpen,
  PenTool,
  RectangleHorizontal,
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

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
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

const Divider = () => <div className="border-border border-t" />;

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-muted-foreground text-[10px] font-semibold tracking-wider uppercase">
    {children}
  </span>
);

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
      const { selections } = me.presence;
      return selections.length === 1 ? selections[0] : null;
    });

    const selectedLayer = useStorage((root) => {
      if (!selectedLayerId) return null;

      return root.layers.get(selectedLayerId);
    });

    const canvasColor = useStorage((root) => root.canvasColor);
    const layers = useStorage((root) => root.layers);
    const layerIds = useStorage((root) => root.layerIds);
    const selections = useSelf((me) => me.presence.selections);

    // Reversed so newest layers appear at the top of the list
    const reversedLayerIds = [...(layerIds ?? [])].reverse();

    const setCanvasColor = useMutation(({ storage }, newColor: Color) => {
      storage.set("canvasColor", newColor);
    }, []);

    const updateLayer = useMutation(
      ({ storage }, options: LayerUpdateOptions) => {
        if (!selectedLayerId) return;
        const liveLayers = storage.get("layers");
        const layer = liveLayers.get(selectedLayerId);
        if (!layer) return;

        layer.update({
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
          ...(options.fontSize !== undefined && { fontSize: options.fontSize }),
          ...(options.fontWeight !== undefined && {
            fontWeight: options.fontWeight,
          }),
          ...(options.opacity !== undefined && { opacity: options.opacity }),
        });
      },
      [selectedLayerId],
    );

    const AvatarRow = (
      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
        {me && (
          <UserAvatar
            isSelf
            color={connectionIdToColor(me.connectionId)}
            name={me.info.name}
          />
        )}

        {others.map((other) => (
          <UserAvatar
            key={other.connectionId}
            color={connectionIdToColor(other.connectionId)}
            name={other.info.name}
          />
        ))}
      </div>
    );

    // ═══════════════════════════════════════════════════════════
    // COLLAPSED — single floating top bar
    // ═══════════════════════════════════════════════════════════
    if (isLeftCollapsed) {
      return (
        <div className="border-border bg-card fixed top-3 right-0 left-0 z-20 mx-auto flex w-fit max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-xl border px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
          {/* Logo */}
          <Link
            href="/dashboard"
            className="text-primary hover:text-primary/90 focus-visible:text-primary/90 shrink-0 transition-colors duration-150 focus-visible:outline-none"
            aria-label="Back to dashboard"
          >
            <OcularIcon size={22} />
          </Link>

          {/* Separator */}
          <div className="bg-border h-5 w-px shrink-0" />

          {/* Room title */}
          <span className="text-foreground max-w-24 truncate text-xs font-medium sm:max-w-40">
            {roomTitle}
          </span>

          {/* Flexible gap */}
          <div className="min-w-3 flex-1 sm:min-w-8" />

          {/* Collaborator avatars */}
          {AvatarRow}

          {/* Share button */}
          <InviteModal roomId={roomId} invitees={invitees} />

          {/* Separator */}
          <div className="bg-border h-5 w-px shrink-0" />

          {/* Expand panels */}
          <button
            type="button"
            onClick={() => setIsLeftCollapsed(false)}
            aria-label="Expand sidebars"
            title="Expand sidebars"
            className="btn btn-icon btn-ghost btn-sm shrink-0"
          >
            <PanelLeftOpen className="size-4" />
          </button>
        </div>
      );
    }

    // ═══════════════════════════════════════════════════════════
    // EXPANDED — left sidebar + right sidebar
    // ═══════════════════════════════════════════════════════════
    return (
      <>
        {/* ── LEFT SIDEBAR ─────────────────────────────────── */}
        <aside className="border-border bg-card fixed top-0 left-0 z-10 flex h-dvh w-60 flex-col border-r">
          {/* Header */}
          <header className="border-border flex items-center gap-2 border-b px-3 py-2.5">
            <Link
              href="/dashboard"
              className="text-primary hover:text-primary/90 focus-visible:text-primary/90 shrink-0 transition-colors duration-150 focus-visible:outline-none"
              aria-label="Back to dashboard"
            >
              <OcularIcon size={26} />
            </Link>

            <h2 className="text-foreground flex-1 truncate text-xs font-medium">
              {roomTitle}
            </h2>

            <button
              type="button"
              onClick={() => setIsLeftCollapsed(true)}
              aria-label="Collapse sidebars"
              title="Collapse"
              className="btn btn-icon btn-ghost btn-sm shrink-0"
            >
              <PanelLeftClose className="size-4" />
            </button>
          </header>

          {/* Layers panel */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5">
              <Layers className="text-muted-foreground size-3.5 shrink-0" />

              <span className="text-foreground text-xs font-medium">
                Layers
              </span>
            </div>
            {/* Layer list */}
            <ul className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-3">
              {layerIds && layerIds.length > 0 ? (
                reversedLayerIds.map((id) => {
                  const layer = layers?.get(id);
                  const isSelected = selections?.includes(id) ?? false;

                  if (layer?.type === LayerType.RECTANGLE)
                    return (
                      <li key={id}>
                        <LayerButton
                          layerId={id}
                          isSelected={isSelected}
                          icon={RectangleHorizontal}
                          label="Rectangle"
                        />
                      </li>
                    );

                  if (layer?.type === LayerType.ELLIPSE)
                    return (
                      <li key={id}>
                        <LayerButton
                          layerId={id}
                          isSelected={isSelected}
                          icon={Ellipse}
                          label="Ellipse"
                        />
                      </li>
                    );

                  if (layer?.type === LayerType.PATH)
                    return (
                      <li key={id}>
                        <LayerButton
                          layerId={id}
                          isSelected={isSelected}
                          icon={PenTool}
                          label="Drawing"
                        />
                      </li>
                    );

                  if (layer?.type === LayerType.TEXT)
                    return (
                      <li key={id}>
                        <LayerButton
                          layerId={id}
                          isSelected={isSelected}
                          icon={Text}
                          label="Text"
                        />
                      </li>
                    );

                  return null;
                })
              ) : (
                <li className="px-2 py-6 text-center">
                  <p className="text-muted-foreground text-xs">
                    No layers yet.
                  </p>
                </li>
              )}
            </ul>
          </div>
        </aside>

        {/* ── RIGHT SIDEBAR ────────────────────────────────── */}
        <aside className="border-border bg-card fixed top-0 right-0 z-10 flex h-dvh w-60 flex-col border-l">
          {/* Header */}
          <div className="border-border flex items-center justify-between gap-2 border-b px-3 py-2.5">
            {AvatarRow}
            <InviteModal roomId={roomId} invitees={invitees} />
          </div>

          {/* Properties panel */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            {selectedLayer ? (
              <>
                {/* Position */}
                <div className="flex flex-col gap-2 p-3">
                  <SectionLabel>Position</SectionLabel>

                  <div className="flex items-center gap-1.5">
                    <NumberInput
                      value={selectedLayer.x}
                      onChange={(val) => updateLayer({ x: val })}
                      icon={MoveHorizontal}
                      className="w-1/2"
                    />

                    <NumberInput
                      value={selectedLayer.y}
                      onChange={(val) => updateLayer({ y: val })}
                      icon={MoveVertical}
                      className="w-1/2"
                    />
                  </div>
                </div>

                {selectedLayer.type !== LayerType.PATH && (
                  <>
                    <Divider />

                    {/* Dimensions */}
                    <div className="flex flex-col gap-2 p-3">
                      <SectionLabel>Dimensions</SectionLabel>

                      <div className="flex items-center gap-1.5">
                        <NumberInput
                          value={selectedLayer.width}
                          onChange={(val) => updateLayer({ width: val })}
                          icon={ArrowLeftRight}
                          className="w-1/2"
                        />

                        <NumberInput
                          value={selectedLayer.height}
                          onChange={(val) => updateLayer({ height: val })}
                          icon={ArrowUpDown}
                          className="w-1/2"
                        />
                      </div>
                    </div>
                  </>
                )}

                <Divider />

                {/* Appearance: opacity + corner radius */}
                <div className="flex flex-col gap-2 p-3">
                  <SectionLabel>Appearance</SectionLabel>

                  <div className="flex items-center gap-1.5">
                    <div className="flex w-1/2 flex-col gap-1">
                      <span className="text-muted-foreground text-[10px]">
                        Opacity
                      </span>

                      <NumberInput
                        min={0}
                        max={1}
                        value={selectedLayer.opacity}
                        onChange={(val) => updateLayer({ opacity: val })}
                        icon={CircleDashed}
                        className="w-full"
                      />
                    </div>

                    {selectedLayer.type === LayerType.RECTANGLE && (
                      <div className="flex w-1/2 flex-col gap-1">
                        <span className="text-muted-foreground text-[10px]">
                          Radius
                        </span>

                        <NumberInput
                          min={0}
                          max={
                            Math.min(
                              selectedLayer.width,
                              selectedLayer.height,
                            ) / 2
                          }
                          value={selectedLayer.cornerRadius ?? 0}
                          onChange={(val) => updateLayer({ cornerRadius: val })}
                          icon={SquareRoundCorner}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Divider />

                {/* Fill */}
                <div className="flex flex-col gap-1.5 p-3">
                  <SectionLabel>Fill</SectionLabel>

                  <ColorPicker
                    color={colorObjToHex(selectedLayer.fill)}
                    onChange={(color) => updateLayer({ fill: color })}
                  />
                </div>

                <Divider />

                {/* Stroke */}
                <div className="flex flex-col gap-1.5 p-3">
                  <SectionLabel>Stroke</SectionLabel>

                  <ColorPicker
                    color={colorObjToHex(selectedLayer.stroke)}
                    onChange={(color) => updateLayer({ stroke: color })}
                  />
                </div>

                {/* Typography (text layers only) */}
                {selectedLayer.type === LayerType.TEXT && (
                  <>
                    <Divider />

                    <div className="flex flex-col gap-2 p-3">
                      <SectionLabel>Typography</SectionLabel>

                      {/* Font family */}
                      <Dropdown
                        value={selectedLayer.fontFamily}
                        onChange={(value) => updateLayer({ fontFamily: value })}
                        options={["Inter", "Arial", "Times New Roman"]}
                      />

                      {/* Size + Weight */}
                      <div className="flex items-end gap-1.5">
                        <div className="flex w-1/2 flex-col gap-1">
                          <span className="text-muted-foreground text-[10px]">
                            Size
                          </span>

                          <NumberInput
                            value={selectedLayer.fontSize}
                            onChange={(value) =>
                              updateLayer({ fontSize: value })
                            }
                            icon={ALargeSmall}
                            className="w-full"
                          />
                        </div>

                        <div className="flex w-1/2 flex-col gap-1">
                          <span className="text-muted-foreground text-[10px]">
                            Weight
                          </span>

                          <Dropdown
                            value={selectedLayer.fontWeight.toString()}
                            onChange={(value) =>
                              updateLayer({ fontWeight: +value })
                            }
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
                  </>
                )}
              </>
            ) : (
              /* ── No selection ── */
              <div className="flex flex-col gap-2 p-3">
                <div className="text-muted-foreground mb-0.5 flex items-center gap-1.5">
                  <Palette className="size-3.5" />
                  <span className="text-xs font-medium">Canvas</span>
                </div>

                <ColorPicker
                  color={canvasColor ? colorObjToHex(canvasColor) : "#1a1a1e"}
                  onChange={(color) => {
                    const rgb = hexToRgb(color);
                    setCanvasColor(rgb ?? { r: 30, g: 30, b: 30 });
                  }}
                />
              </div>
            )}
          </div>
        </aside>
      </>
    );
  },
);

Sidebars.displayName = "Sidebars";

export default Sidebars;
