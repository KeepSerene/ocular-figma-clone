"use client";

import React from "react";
import { Loader2, X } from "lucide-react";
import { memo, useState } from "react";
import z from "zod";
import {
  deleteInvitationAction,
  shareRoomAction,
} from "~/actions/room.actions";
import UserAvatar from "./UserAvatar";
import type { Invitee } from "~/app/dashboard/designs/[designId]/page";

interface InviteModalProps {
  roomId: string;
  invitees: Invitee[];
}

const InviteModal = memo(({ roomId, invitees }: InviteModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | undefined>(undefined);

  // Track deletion state per invitee instead of one global boolean
  const [deletingByInvitee, setDeletingByInvitee] = useState<
    Record<string, boolean>
  >({});

  // Track deletion errors per invitee instead of one global error
  const [deleteErrorByInvitee, setDeleteErrorByInvitee] = useState<
    Record<string, string | undefined>
  >({});

  const inviteUser = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = z.string().email().safeParse(email);

    if (!parsed.success) {
      setInviteError("Invalid email address");
      return;
    }

    setIsInviting(true);
    setInviteError(undefined);

    try {
      await shareRoomAction(roomId, email);
      setEmail("");
    } catch (error) {
      console.error("Failed to invite user:", error);
      setInviteError(
        error instanceof Error ? error.message : "Oops! Something went wrong.",
      );
    } finally {
      setIsInviting(false);
    }
  };

  const handleDeleteInvitation = async (
    roomId: string,
    inviteeEmail: string,
  ) => {
    // Mark only this invitee as deleting
    setDeletingByInvitee((prev) => ({
      ...prev,
      [inviteeEmail]: true,
    }));

    // Clear just this invitee's previous delete error
    setDeleteErrorByInvitee((prev) => ({
      ...prev,
      [inviteeEmail]: undefined,
    }));

    try {
      await deleteInvitationAction(roomId, inviteeEmail);

      // Clear the error again after a successful delete, just in case
      setDeleteErrorByInvitee((prev) => ({
        ...prev,
        [inviteeEmail]: undefined,
      }));
    } catch (error) {
      console.error("Failed to delete invitation:", error);

      // Store the error for only this invitee row
      setDeleteErrorByInvitee((prev) => ({
        ...prev,
        [inviteeEmail]:
          error instanceof Error
            ? error.message
            : "Oops! Something went wrong.",
      }));
    } finally {
      // Always reset only this invitee's loading state
      setDeletingByInvitee((prev) => ({
        ...prev,
        [inviteeEmail]: false,
      }));
    }
  };

  return (
    <>
      {/* Modal trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="size-fit rounded-md bg-[#0c8ce9] px-4 py-2 text-xs font-medium text-white transition-colors duration-150 hover:bg-[#0c8ce9]/90 focus-visible:bg-[#0c8ce9]/90 focus-visible:outline-none"
      >
        Share
      </button>

      {/* Invite modal */}
      {isOpen && (
        // Backdrop overlay
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-10 flex items-center justify-center bg-gray-600/50"
        >
          {/* Modal */}
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-modal-title"
            aria-describedby="invite-modal-description"
            onClick={(event) => event.stopPropagation()}
            className="flex w-full max-w-md flex-col rounded-xl bg-white shadow-xl"
          >
            {/* Heading */}
            <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
              <h3 id="invite-modal-title" className="text-sm font-semibold">
                Share this design
              </h3>

              <p id="invite-modal-description" className="sr-only">
                Invite users to collaborate on this design by email.
              </p>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close share modal"
                title="Close"
                className="rounded-full p-1 transition-colors duration-150 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-2 p-4">
              {/* Invite form */}
              <form
                onSubmit={inviteUser}
                className="flex h-8 items-center gap-x-2"
              >
                <label htmlFor="invite-email" className="sr-only">
                  Email address
                </label>

                <input
                  type="email"
                  id="invite-email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoFocus
                  placeholder="Search by email"
                  className="size-full rounded-md border-2 border-[#f5f5f5] bg-[#f5f5f5] px-3 py-1 text-xs transition-colors duration-200 outline-none placeholder:text-gray-500 hover:border-[#e8e8e8] focus:border-blue-500"
                />

                <button
                  type="submit"
                  disabled={isInviting}
                  className="h-full rounded-md bg-[#0c8ce9] px-4 py-2 text-xs font-medium text-white transition-colors duration-150 hover:bg-[#0c8ce9]/90 focus-visible:bg-[#0c8ce9]/90 focus-visible:outline-none disabled:opacity-50"
                >
                  {isInviting ? "Inviting..." : "Invite"}
                </button>
              </form>

              {inviteError && (
                <p className="text-xs text-red-500">{inviteError}</p>
              )}

              {invitees.length > 0 && (
                <>
                  <p className="text-xs text-gray-500">Invited users</p>

                  <ul className="space-y-2">
                    {invitees.map((invitee) => {
                      // Use invitee email as the row key for loading/error lookup
                      const isDeleting = deletingByInvitee[invitee.email];
                      const deleteError = deleteErrorByInvitee[invitee.email];

                      return (
                        <React.Fragment key={invitee.id}>
                          <li className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-x-2">
                              <UserAvatar
                                name={invitee.email}
                                className="size-6"
                              />

                              <span className="text-xs select-none">
                                {invitee.email}
                              </span>
                            </div>

                            <div className="flex items-center gap-x-1">
                              <span className="text-xs text-gray-500">
                                Full-Access
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteInvitation(roomId, invitee.email)
                                }
                                disabled={isDeleting}
                                aria-label={`Revoke access for ${invitee.email}`}
                                title="Revoke access"
                                className="text-gray-400 transition-colors duration-150 hover:text-gray-500 focus-visible:text-gray-500 focus-visible:outline-none disabled:opacity-50"
                              >
                                {isDeleting ? (
                                  <Loader2 className="size-4 animate-spin" />
                                ) : (
                                  <X className="size-4" />
                                )}
                              </button>
                            </div>
                          </li>

                          {/* Show delete error only for the matching invitee row */}
                          {deleteError && (
                            <p className="text-[10px] text-red-500">
                              {deleteError}
                            </p>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
});

InviteModal.displayName = "InviteModal";

export default InviteModal;
