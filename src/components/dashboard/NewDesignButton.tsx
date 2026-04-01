"use client";

import { useTransition } from "react";
import { createRoomAction } from "~/actions/room.actions";
import { Loader2, Plus } from "lucide-react";

function NewDesignButton() {
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      await createRoomAction();
    });
  };

  return (
    <button
      type="button"
      onClick={handleCreate}
      disabled={isPending}
      className="btn btn-primary btn-md w-fit gap-2"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Plus className="size-4" />
      )}
      <span>{isPending ? "Creating..." : "New Design"}</span>
    </button>
  );
}

export default NewDesignButton;
