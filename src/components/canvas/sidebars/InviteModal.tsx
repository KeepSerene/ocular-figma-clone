"use client";

import React from "react";
import { Loader2, UserPlus2, X } from "lucide-react";
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
  const [deletingByInvitee, setDeletingByInvitee] = useState<
    Record<string, boolean>
  >({});
  const [deleteErrorByInvitee, setDeleteErrorByInvitee] = useState<
    Record<string, string | undefined>
  >({});

  const inviteUser = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = z.string().email().safeParse(email);

    if (!parsed.success) {
      setInviteError("Please enter a valid email address.");
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
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsInviting(false);
    }
  };

  const handleDeleteInvitation = async (
    roomId: string,
    inviteeEmail: string,
  ) => {
    setDeletingByInvitee((prev) => ({ ...prev, [inviteeEmail]: true }));
    setDeleteErrorByInvitee((prev) => ({
      ...prev,
      [inviteeEmail]: undefined,
    }));

    try {
      await deleteInvitationAction(roomId, inviteeEmail);
    } catch (error) {
      console.error("Failed to revoke invitation:", error);
      setDeleteErrorByInvitee((prev) => ({
        ...prev,
        [inviteeEmail]:
          error instanceof Error ? error.message : "Something went wrong.",
      }));
    } finally {
      setDeletingByInvitee((prev) => ({ ...prev, [inviteeEmail]: false }));
    }
  };

  return (
    <>
      {/* Trigger — Share button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn btn-primary btn-sm shrink-0 gap-1"
      >
        <UserPlus2 className="size-3.5" />
        Share
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-modal-title"
            onClick={(event) => event.stopPropagation()}
            className="border-border bg-card flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border shadow-2xl"
          >
            {/* Header */}
            <div className="border-border flex items-center justify-between border-b px-5 py-4">
              <div>
                <h3
                  id="invite-modal-title"
                  className="text-foreground text-sm font-semibold"
                >
                  Share design
                </h3>

                <p id="invite-modal-description" className="sr-only">
                  Invite collaborators by email.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="btn btn-icon btn-ghost btn-sm"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex flex-col gap-4 p-5">
              {/* Invite form */}
              <form onSubmit={inviteUser} className="flex items-center gap-2">
                <label htmlFor="invite-email" className="sr-only">
                  Email address
                </label>

                <input
                  type="email"
                  id="invite-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  placeholder="colleague@email.com"
                  className="border-input bg-background text-foreground placeholder:text-muted-foreground/50 focus:border-ring h-9 flex-1 rounded-md border px-3 text-sm transition-colors duration-150 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={isInviting}
                  className="btn btn-primary btn-sm shrink-0"
                >
                  {isInviting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    "Invite"
                  )}
                </button>
              </form>

              {inviteError && (
                <p className="text-destructive text-xs">{inviteError}</p>
              )}

              {/* Invited users list */}
              {invitees.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground text-[11px] font-medium">
                    People with access
                  </p>

                  <ul className="divide-border flex flex-col divide-y">
                    {invitees.map((invitee) => {
                      const isDeleting = deletingByInvitee[invitee.email];
                      const deleteError = deleteErrorByInvitee[invitee.email];

                      return (
                        <React.Fragment key={invitee.id}>
                          <li className="flex items-center justify-between py-2.5">
                            <div className="flex items-center gap-2.5">
                              <UserAvatar
                                name={invitee.email}
                                className="size-7"
                              />
                              <div className="flex flex-col">
                                <span className="text-foreground max-w-40 truncate text-xs font-medium">
                                  {invitee.email}
                                </span>

                                <span className="text-muted-foreground text-[10px]">
                                  Can edit
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteInvitation(roomId, invitee.email)
                              }
                              disabled={isDeleting}
                              aria-label={`Revoke access for ${invitee.email}`}
                              title="Revoke access"
                              className="btn btn-icon btn-ghost btn-sm text-muted-foreground hover:text-destructive disabled:opacity-50"
                            >
                              {isDeleting ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <X className="size-3.5" />
                              )}
                            </button>
                          </li>

                          {deleteError && (
                            <p className="text-destructive pb-1 text-[10px]">
                              {deleteError}
                            </p>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </ul>
                </div>
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
