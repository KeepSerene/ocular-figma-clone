"use server";

import { Prisma } from "generated/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { liveblocks } from "~/server/liveblocks";

export async function createRoomAction() {
  let newRoomId: string;

  try {
    const session = await auth();

    if (!session?.user) throw new Error("Unauthorized: no active session");

    const room = await db.room.create({
      data: {
        owner: {
          connect: { id: session.user.id },
        },
      },
      select: { id: true },
    });

    newRoomId = room.id;
  } catch (error) {
    console.error("Error in create room action:", error);
    return;
  }

  redirect(`/dashboard/designs/${newRoomId}`);
}

export async function updateRoomTitleAction(roomId: string, newTitle: string) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized: no active session");
  }

  if (!newTitle.trim() || newTitle.length > 50) {
    throw new Error("Invalid title");
  }

  const result = await db.room.updateMany({
    where: {
      id: roomId,
      ownerId: session.user.id,
    },
    data: {
      title: newTitle,
    },
  });

  if (result.count === 0) {
    throw new Error("Room not found or unauthorized");
  }

  revalidatePath("/dashboard");
}

export async function deleteRoomAction(roomId: string) {
  const session = await auth();

  if (!session?.user) throw new Error("Unauthorized: no active session");

  const result = await db.room.deleteMany({
    where: { id: roomId, ownerId: session.user.id },
  });

  if (result.count === 0) {
    throw new Error("Room not found or unauthorized");
  }

  // Delete the Liveblocks room storage
  // The Liveblocks room ID is "room:<dbRoomId>" — matching the
  // convention set in DesignPage and the auth route
  try {
    await liveblocks.deleteRoom(`room:${roomId}`);
  } catch (error) {
    // Don't fail the whole action if Liveblocks deletion fails —
    // the DB record is already gone. Just log it...
    console.error(
      `Failed to delete Liveblocks room storage — room:${roomId}:`,
      error,
    );
  }

  revalidatePath("/dashboard");
}

export async function shareRoomAction(roomId: string, inviteeEmail: string) {
  const session = await auth();

  if (!session?.user) throw new Error("Unauthorized: no active session");

  // Validate email format
  const parsed = z.string().email().safeParse(inviteeEmail);

  if (!parsed.success) throw new Error("Invalid email address");

  // Guard
  if (inviteeEmail === session.user.email) {
    throw new Error("You can't invite yourself");
  }

  // Parallel: verify ownership and look up invitee simultaneously
  const [room, invitee] = await Promise.all([
    db.room.findUnique({
      where: { id: roomId, ownerId: session.user.id },
      select: { id: true },
    }),
    db.user.findUnique({
      where: { email: inviteeEmail },
      select: { id: true },
    }),
  ]);

  if (!room) throw new Error("Room not found or you don't own it");
  if (!invitee) throw new Error("No user found with that email address");

  try {
    await db.roomInvitation.create({
      data: { roomId, inviteeId: invitee.id },
    });
  } catch (error) {
    // P2002 = unique constraint violation — the @@unique([roomId, inviteeId])
    // constraint on RoomInvitation caught a duplicate invite attempt
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("This user has already been invited");
    }
    throw error;
  }

  revalidatePath("/dashboard");
}

export async function deleteInvitationAction(
  roomId: string,
  inviteeEmail: string,
) {
  const session = await auth();

  if (!session?.user) throw new Error("Unauthorized: no active session");

  const invitee = await db.user.findUnique({
    where: { email: inviteeEmail },
    select: { id: true },
  });

  if (!invitee) throw new Error("No user found with that email address");

  // Only two people have the right to remove an invitation:
  // 1. The invitee themselves — rejecting the invite
  // 2. The room owner — revoking the invite
  const isInvitee = session.user.email === inviteeEmail;
  const isOwner = await db.room.findUnique({
    where: { id: roomId, ownerId: session.user.id },
    select: { id: true },
  });

  if (!isInvitee && !isOwner) {
    throw new Error("You don't have permission to remove this invitation");
  }

  const result = await db.roomInvitation.deleteMany({
    where: { roomId, inviteeId: invitee.id },
  });

  if (result.count === 0) throw new Error("Invitation not found");

  revalidatePath("/dashboard");
}
