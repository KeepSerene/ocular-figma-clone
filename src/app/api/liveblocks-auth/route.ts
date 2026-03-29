import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { liveblocks } from "~/server/liveblocks";

export async function POST(_req: Request) {
  try {
    // 1. Get the current user session
    const userSession = await auth();

    if (!userSession?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUniqueOrThrow({
      where: { id: userSession.user.id },
      include: {
        ownedRooms: true,
        roomInvitations: {
          include: {
            room: true,
          },
        },
      },
    });

    // 2. Start a liveblocks session
    const liveblocksSession = liveblocks.prepareSession(user.id, {
      userInfo: {
        name: user.name ?? user.email ?? "Anonymous User",
      },
    });

    // 3. Give user full-access to all the rooms they own (created)
    user.ownedRooms.map((room) => {
      liveblocksSession.allow(`room:${room.id}`, liveblocksSession.FULL_ACCESS);
    });

    // 4. Give user full-access to all the rooms they were invited to
    user.roomInvitations.map((invitee) => {
      liveblocksSession.allow(
        `room:${invitee.roomId}`,
        liveblocksSession.FULL_ACCESS,
      );
    });

    // 5. Authorize the user and return the result
    const { status, body } = await liveblocksSession.authorize();

    return new Response(body, { status });
  } catch (error) {
    console.error("Liveblocks Auth Error:", error);

    return new Response("Internal Error", { status: 500 });
  }
}
