import { Liveblocks } from "@liveblocks/node";
import { env } from "~/env";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

const liveblocks = new Liveblocks({
  secret: env.LIVEBLOCKS_SECRET_KEY,
});

export async function POST(req: Request) {
  try {
    // 1. Get the current user session
    const userSession = await auth();

    // Guard
    if (!userSession?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUniqueOrThrow({
      where: { id: userSession.user.id },
    });

    // 2. Start a liveblocks session
    const liveblocksSession = liveblocks.prepareSession(user.id, {
      userInfo: {
        name: user.name ?? user.email ?? "Anonymous User",
      },
    });

    // 3. Extract the room from the request body
    // Liveblocks sends this automatically when the client connects
    const { room } = await req.json();

    // 4. Grant access
    const roomId = room || "room:test";
    liveblocksSession.allow(roomId, liveblocksSession.FULL_ACCESS);

    // 5. Authorize the user and return the result
    const { status, body } = await liveblocksSession.authorize();

    return new Response(body, { status });
  } catch (error) {
    console.error("Liveblocks Auth Error:", error);

    return new Response("Internal Error", { status: 500 });
  }
}
