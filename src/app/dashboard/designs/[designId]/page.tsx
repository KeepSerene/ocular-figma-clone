import type { Metadata } from "next";
import Room from "~/components/liveblocks/Room";
import Canvas from "~/components/canvas/Canvas";
import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: "Design",
};

type DesignPageProps = Promise<{ designId: string }>;

export type Invitee = {
  id: string;
  email: string;
};

// Liveblocks room page
async function DesignPage({ params }: { params: DesignPageProps }) {
  const { designId } = await params;

  const room = await db.room.findUnique({
    where: { id: designId },
    select: {
      id: true,
      title: true,
      ownerId: true,
      roomInvitations: {
        select: {
          invitee: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!room) {
    return redirect("/not-found");
  }

  const inviteeIds = room.roomInvitations.map(
    (invitation) => invitation.invitee.id,
  );

  const session = await auth();

  if (!session) throw new Error("Unauthorized");

  if (
    session.user.id !== room.ownerId &&
    !inviteeIds.includes(session.user.id)
  ) {
    return redirect("/not-found");
  }

  return (
    <Room roomId={`room:${designId}`}>
      <Canvas
        roomId={room.id}
        roomTitle={room.title}
        invitees={room.roomInvitations.map((invitation) => invitation.invitee)}
      />
    </Room>
  );
}

export default DesignPage;
