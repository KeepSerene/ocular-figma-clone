import type { Metadata } from "next";
import Room from "~/components/liveblocks/Room";
import Canvas from "~/components/canvas/Canvas";
import { db } from "~/server/db";
import { notFound } from "next/navigation";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: "Design",
  description:
    "An active Ocular design canvas. Draw shapes, write text, sketch freehand, and collaborate with your team in real time.",
  // Design canvases are private and access-controlled — keep them out of search indexes
  robots: { index: false, follow: false },
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
    notFound();
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
    notFound();
  }

  return (
    <div className="overflow-hidden overscroll-none">
      <Room roomId={`room:${designId}`}>
        <Canvas
          roomId={room.id}
          roomTitle={room.title}
          invitees={room.roomInvitations.map(
            (invitation) => invitation.invitee,
          )}
        />
      </Room>
    </div>
  );
}

export default DesignPage;
