import type { Metadata } from "next";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import UserMenu from "~/components/dashboard/UserMenu";
import NewDesignButton from "~/components/dashboard/NewDesignButton";
import DesignLibrary from "~/components/dashboard/DesignLibrary";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function DashboardPage() {
  const session = await auth();

  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      ownedRooms: true,
      roomInvitations: {
        include: { room: true },
      },
    },
  });

  if (!user) return null;

  return (
    <main className="flex h-dvh w-full">
      {/* Left sidebar */}
      <aside className="flex h-dvh min-w-66 flex-col rounded-lg border-r border-gray-200 bg-white p-2 shadow-md">
        <UserMenu email={user.email} />

        {/* TO-DO: PUT NOTES/TIPS RELATED TO THE ROOM CANVAS HERE... */}
      </aside>

      <section className="flex h-dvh w-full flex-1 flex-col">
        <div className="flex min-h-12.5 items-center border-b border-gray-200 bg-white pl-8">
          <h2 className="text-sm font-semibold select-none">Recents</h2>
        </div>

        <div className="flex h-full flex-1 flex-col gap-10 p-8">
          <NewDesignButton />

          <DesignLibrary
            ownedRooms={user.ownedRooms}
            invitedRooms={user.roomInvitations.map(
              (invitation) => invitation.room,
            )}
          />
        </div>
      </section>
    </main>
  );
}

export default DashboardPage;
