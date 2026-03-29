"use client";

import type { Room } from "generated/prisma";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import {
  deleteRoomAction,
  updateRoomTitleAction,
} from "~/actions/room.actions";

interface DesignLibraryProps {
  ownedRooms: Room[];
  invitedRooms: Room[];
}

type RoomType = "owned" | "shared"; // "shared" = "invited"

interface RoomTypeTabButtonProps {
  onSelect: () => void;
  isActive: boolean;
  label: string;
}

const RoomTypeTabButton = ({
  onSelect,
  isActive,
  label,
}: RoomTypeTabButtonProps) => (
  <button
    type="button"
    onClick={onSelect}
    className={`rounded-md p-1 text-xs transition-colors duration-150 select-none hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none ${isActive ? "bg-gray-100" : ""}`}
  >
    {label}
  </button>
);

interface RoomCardProps {
  id: string;
  title: string;
  canEditTitle: boolean;
  description: string;
  color: string;
  isSelected: boolean;
  select: () => void;
  navigateTo: () => void;
  canDelete: boolean;
}

function RoomCard({
  id,
  title,
  canEditTitle,
  description,
  color,
  isSelected,
  select,
  navigateTo,
  canDelete,
}: RoomCardProps) {
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);
  const [isDeletingRoom, setIsDeletingRoom] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const saveTitle = async () => {
    if (!canEditTitle) return;

    const trimmedTitle = editedTitle.trim();

    if (!trimmedTitle || trimmedTitle.length > 50) return;

    setIsEditingTitle(false);
    setIsUpdatingTitle(true);

    try {
      await updateRoomTitleAction(id, trimmedTitle);
    } catch (error) {
      console.error("Failed to save/update Design title:", error);
    } finally {
      setIsUpdatingTitle(false);
    }
  };

  const handleKeyDown = async (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      await saveTitle();
    }
  };

  const handleDeleteRoom = async () => {
    if (!canDelete || isDeletingRoom) return;

    setIsDeletingRoom(true);

    try {
      await deleteRoomAction(id);
      setShowConfirmationModal(false);
    } catch (error) {
      console.error("Failed to delete Design:", error);
    } finally {
      setIsDeletingRoom(false);
    }
  };

  // Keep title and editedTitle in sync
  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  // Delete room on Backspace
  useEffect(() => {
    if (!isSelected) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Backspace" &&
        isSelected &&
        !isEditingTitle &&
        canDelete
      ) {
        event.preventDefault();
        setShowConfirmationModal(true);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isSelected, isEditingTitle, canDelete, setShowConfirmationModal]);

  return (
    <div className="grid grid-cols-1 gap-0.5">
      <div
        role="button"
        tabIndex={0}
        onDoubleClick={navigateTo}
        onClick={select}
        style={{ backgroundColor: color }}
        className={`flex h-56 w-sm cursor-pointer items-center justify-center rounded-md ${isSelected ? "border-2 border-blue-500" : "border border-[#e8e8e8]"}`}
      >
        <p className="flex items-center gap-1 font-medium select-none">
          <span>{editedTitle}</span>
          {isUpdatingTitle && (
            <span className="text-xs text-gray-600">(saving...)</span>
          )}
        </p>
      </div>

      {canEditTitle && isEditingTitle ? (
        <input
          type="text"
          maxLength={50}
          value={editedTitle}
          onChange={(event) => setEditedTitle(event.target.value)}
          onBlur={saveTitle}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder="Title goes here..."
          aria-label="Enter design room title"
          className="mt-1 w-full rounded-md border-2 border-white bg-white p-1 text-sm transition-colors duration-150 outline-none hover:border-[#e8e8e8] focus:border-blue-500"
        />
      ) : (
        <p
          onClick={() => setIsEditingTitle(true)}
          className="mt-2 flex items-center gap-1 text-sm font-medium select-none"
        >
          <span>{editedTitle}</span>
          {isUpdatingTitle && (
            <span className="text-gray-400">(saving...)</span>
          )}
        </p>
      )}

      <p className="text-[10px] text-gray-400 select-none">{description}</p>

      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => {
          if (!isDeletingRoom) {
            setShowConfirmationModal(false);
          }
        }}
        onConfirm={handleDeleteRoom}
        title="Delete Design?"
        description="This will permanently remove your work."
        variant="danger"
        confirmText={isDeletingRoom ? "Deleting..." : "Delete"}
        isLoading={isDeletingRoom}
      />
    </div>
  );
}

const PASTEL_COLORS = [
  "rgb(255, 182, 193)", // pink
  "rgb(176, 224, 230)", // powder blue
  "rgb(221, 160, 221)", // plum
  "rgb(188, 143, 143)", // rosy brown
  "rgb(152, 251, 152)", // pale green
  "rgb(238, 232, 170)", // pale goldenrod
  "rgb(230, 230, 250)", // lavender
  "rgb(255, 218, 185)", // peach
] as const;

function DesignLibrary({ ownedRooms, invitedRooms }: DesignLibraryProps) {
  const [roomType, setRoomType] = useState<RoomType>("owned");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const roomCardsWrapperRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const filteredRooms = useMemo(() => {
    if (roomType === "owned") return ownedRooms;
    else if (roomType === "shared") return invitedRooms;

    return [];
  }, [roomType, ownedRooms, invitedRooms]);

  const roomColorMap = useMemo(() => {
    const map = new Map<string, string>();

    filteredRooms.forEach((room, index) => {
      map.set(room.id, PASTEL_COLORS[index % PASTEL_COLORS.length]!);
    });

    return map;
  }, [filteredRooms]);

  // Deselect room card when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        roomCardsWrapperRef.current &&
        !roomCardsWrapperRef.current.contains(event.target as Node)
      ) {
        setSelectedRoomId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSelectedRoomId]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-1">
        <RoomTypeTabButton
          onSelect={() => setRoomType("owned")}
          isActive={roomType === "owned"}
          label="My Designs"
        />

        <RoomTypeTabButton
          onSelect={() => setRoomType("shared")}
          isActive={roomType === "shared"}
          label="Shared Designs"
        />
      </div>

      <div
        ref={roomCardsWrapperRef}
        className="flex flex-wrap items-center gap-4"
      >
        {filteredRooms.map((room) => {
          const roomColor = roomColorMap.get(room.id) ?? PASTEL_COLORS[0];

          return (
            <RoomCard
              key={room.id}
              id={room.id}
              title={room.title}
              canEditTitle={roomType === "owned"}
              description={`Created at ${room.createdAt.toDateString()}`}
              color={roomColor}
              isSelected={selectedRoomId === room.id}
              select={() => setSelectedRoomId(room.id)}
              navigateTo={() => router.push(`/dashboard/designs/${room.id}`)}
              canDelete={roomType === "owned"}
            />
          );
        })}
      </div>
    </div>
  );
}

export default DesignLibrary;
