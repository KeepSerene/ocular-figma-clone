"use client";

import { SquarePlus } from "lucide-react";
import { createRoomAction } from "~/actions/room.actions";

const NewDesignButton = () => (
  <button
    type="button"
    onClick={createRoomAction}
    className="group flex size-fit items-center gap-2 rounded-xl bg-gray-100 px-6 py-5 transition-colors duration-200 select-none hover:bg-blue-500 focus-visible:bg-blue-500 focus-visible:outline-none"
  >
    <span className="flex size-fit items-center justify-center rounded-full bg-blue-600 p-2">
      <SquarePlus className="size-4 text-white" />
    </span>

    <span className="flex flex-col items-start gap-0.5 text-xs">
      <span className="font-semibold group-hover:text-white group-focus-visible:text-white">
        New Design
      </span>

      <span className="group-hover:text-white group-focus-visible:text-white">
        Set your creativity free...
      </span>
    </span>
  </button>
);

export default NewDesignButton;
