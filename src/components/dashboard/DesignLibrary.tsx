"use client";

import type { Room } from "generated/prisma";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import {
  deleteRoomAction,
  updateRoomTitleAction,
} from "~/actions/room.actions";
import { LayoutGrid, Users, Pencil, Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DesignLibraryProps {
  ownedRooms: Room[];
  invitedRooms: Room[];
}

type RoomType = "owned" | "shared";

// ─── Gradient utility ─────────────────────────────────────────────────────────

const GRADIENTS = [
  ["oklch(0.35 0.09 48)", "oklch(0.20 0.04 48)"], // amber
  ["oklch(0.30 0.07 196)", "oklch(0.20 0.04 196)"], // teal
  ["oklch(0.30 0.08 270)", "oklch(0.20 0.05 270)"], // violet
  ["oklch(0.28 0.07 150)", "oklch(0.18 0.04 150)"], // green
  ["oklch(0.30 0.08 320)", "oklch(0.20 0.04 320)"], // pink/rose
  ["oklch(0.30 0.08 220)", "oklch(0.20 0.04 220)"], // blue
  ["oklch(0.30 0.08 30)", "oklch(0.20 0.04 30)"], // orange
  ["oklch(0.28 0.06 10)", "oklch(0.20 0.03 10)"], // red
] as const;

function getCardGradient(roomId: string): string {
  const hash = roomId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const [c1, c2] = GRADIENTS[hash % GRADIENTS.length]!;

  return `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Tab button ───────────────────────────────────────────────────────────────
interface TabButtonProps {
  onSelect: () => void;
  isActive: boolean;
  label: string;
  icon: React.ReactNode;
}

const TabButton = ({ onSelect, isActive, label, icon }: TabButtonProps) => (
  <button
    type="button"
    onClick={onSelect}
    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 select-none ${
      isActive
        ? "bg-accent text-foreground"
        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground focus-visible:bg-accent/50 focus-visible:outline-none"
    } `}
  >
    {icon}
    {label}
  </button>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  type: RoomType;
}

function EmptyState({ type }: EmptyStateProps) {
  const isOwned = type === "owned";

  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="border-border bg-card flex size-14 items-center justify-center rounded-2xl border">
        {isOwned ? (
          <LayoutGrid className="text-muted-foreground/50 size-6" />
        ) : (
          <Users className="text-muted-foreground/50 size-6" />
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <p className="text-foreground text-sm font-medium">
          {isOwned ? "No designs yet" : "No shared designs"}
        </p>

        <p className="text-muted-foreground max-w-xs text-xs leading-relaxed">
          {isOwned
            ? 'Hit "New Design" to create your first canvas and start building.'
            : "When someone invites you to their design, it will appear here."}
        </p>
      </div>
    </div>
  );
}

// ─── Room card ────────────────────────────────────────────────────────────────
interface RoomCardProps {
  id: string;
  title: string;
  canEditTitle: boolean;
  createdAt: Date;
  isSelected: boolean;
  select: () => void;
  navigateTo: () => void;
  canDelete: boolean;
}

function RoomCard({
  id,
  title,
  canEditTitle,
  createdAt,
  isSelected,
  select,
  navigateTo,
  canDelete,
}: RoomCardProps) {
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [isDeletingRoom, setIsDeletingRoom] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const gradient = useMemo(() => getCardGradient(id), [id]);

  const saveTitle = useCallback(async () => {
    if (!canEditTitle) return;

    const trimmed = editedTitle.trim();
    const originalTrimmed = title.trim();

    if (!trimmed || trimmed.length > 50) {
      // Reset back to original
      setEditedTitle(originalTrimmed);
      setIsEditingTitle(false);
      return;
    }

    if (trimmed === originalTrimmed) {
      // Prevent a wasted server call
      setIsEditingTitle(false);
      return;
    }

    setIsEditingTitle(false);
    setIsUpdatingTitle(true);

    try {
      await updateRoomTitleAction(id, trimmed);
    } catch (error) {
      console.error("Failed to update design title:", error);
      setEditedTitle(originalTrimmed); // revert if the server request fails
    } finally {
      setIsUpdatingTitle(false);
    }
  }, [canEditTitle, editedTitle, id, title]);

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      await saveTitle();
    } else if (event.key === "Escape") {
      setEditedTitle(title);
      setIsEditingTitle(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!canDelete || isDeletingRoom) return;

    setIsDeletingRoom(true);

    try {
      await deleteRoomAction(id);
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Failed to delete design:", error);
    } finally {
      setIsDeletingRoom(false);
    }
  };

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  useEffect(() => {
    if (!isSelected) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest("input, textarea, [contenteditable]")
      ) {
        return;
      }

      if (event.key === "Backspace" && !isEditingTitle && canDelete) {
        event.preventDefault();
        setShowConfirmModal(true);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isSelected, isEditingTitle, canDelete]);

  useEffect(() => {
    if (isEditingTitle) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditingTitle]);

  return (
    <>
      <div
        className={`group bg-card flex flex-col gap-0 rounded-xl border transition-all duration-150 ${
          isSelected
            ? "border-primary/60 shadow-[0_0_0_2px_color-mix(in_oklch,var(--primary),transparent_75%)]"
            : "border-border hover:border-border/80"
        }`}
        onClick={select}
        onDoubleClick={navigateTo}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter") navigateTo();
        }}
        aria-label={`Design: ${title}`}
      >
        {/* Thumbnail */}
        <div
          className="relative h-40 overflow-hidden rounded-t-xl"
          style={{ backgroundImage: gradient }}
        >
          {/* Subtle grid pattern overlay */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Navigate on double-click hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <span className="rounded-md bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-sm select-none">
              Double-click to open
            </span>
          </div>
        </div>

        {/* Card footer */}
        <div className="flex flex-col gap-0.5 px-3 py-2.5">
          {/* Editable title */}
          {canEditTitle && isEditingTitle ? (
            <input
              ref={inputRef}
              type="text"
              maxLength={50}
              value={editedTitle}
              onChange={(event) => setEditedTitle(event.target.value)}
              onBlur={saveTitle}
              onKeyDown={handleKeyDown}
              onClick={(event) => event.stopPropagation()}
              aria-label="Edit design title"
              className="border-primary text-foreground w-full rounded border bg-transparent px-1 py-0.5 text-sm font-medium outline-none"
            />
          ) : (
            <div className="flex items-center gap-1.5">
              <p className="text-foreground flex-1 truncate text-sm font-medium select-none">
                {editedTitle}

                {isUpdatingTitle && (
                  <Loader2 className="text-muted-foreground ml-1.5 inline size-3 animate-spin" />
                )}
              </p>

              {canEditTitle && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsEditingTitle(true);
                  }}
                  aria-label="Edit title"
                  title="Edit title"
                  className="text-muted-foreground hover:text-foreground shrink-0 opacity-100 transition-opacity group-focus-within:opacity-100 focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <Pencil className="size-3" />
                </button>
              )}
            </div>
          )}

          <p className="text-muted-foreground/60 text-[11px] select-none">
            {formatDate(createdAt)}
          </p>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          if (!isDeletingRoom) setShowConfirmModal(false);
        }}
        onConfirm={handleDeleteRoom}
        title="Delete design?"
        description="This action is permanent and cannot be undone. Your work will be lost."
        variant="danger"
        confirmText={isDeletingRoom ? "Deleting..." : "Delete"}
        isLoading={isDeletingRoom}
      />
    </>
  );
}

// ─── Design library ───────────────────────────────────────────────────────────
function DesignLibrary({ ownedRooms, invitedRooms }: DesignLibraryProps) {
  const [roomType, setRoomType] = useState<RoomType>("owned");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const filteredRooms = useMemo(
    () => (roomType === "owned" ? ownedRooms : invitedRooms),
    [roomType, ownedRooms, invitedRooms],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (gridRef.current && !gridRef.current.contains(event.target as Node)) {
        setSelectedRoomId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Tab bar */}
      <div className="flex items-center gap-1">
        <TabButton
          onSelect={() => setRoomType("owned")}
          isActive={roomType === "owned"}
          label="My Designs"
          icon={<LayoutGrid className="size-3.5" />}
        />

        <TabButton
          onSelect={() => setRoomType("shared")}
          isActive={roomType === "shared"}
          label="Shared with me"
          icon={<Users className="size-3.5" />}
        />
      </div>

      {/* Grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filteredRooms.length === 0 ? (
          <EmptyState type={roomType} />
        ) : (
          filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              id={room.id}
              title={room.title}
              canEditTitle={roomType === "owned"}
              createdAt={room.createdAt}
              isSelected={selectedRoomId === room.id}
              select={() => setSelectedRoomId(room.id)}
              navigateTo={() => router.push(`/dashboard/designs/${room.id}`)}
              canDelete={roomType === "owned"}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default DesignLibrary;
