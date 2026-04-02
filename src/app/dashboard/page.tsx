import type { Metadata } from "next";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import NewDesignButton from "~/components/dashboard/NewDesignButton";
import DesignLibrary from "~/components/dashboard/DesignLibrary";
import Sidebar from "~/components/dashboard/Sidebar";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Your Ocular workspace. Create new designs, revisit recent canvases, and access projects shared with you.",
  // Authenticated pages should not be indexed by search engines
  robots: { index: false, follow: false },
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
    <main className="bg-background flex h-dvh w-full overflow-hidden">
      {/* Left sidebar */}
      <Sidebar email={user.email} />

      {/* Main content area */}
      <section className="flex h-dvh min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <div className="border-border bg-card flex min-h-12 shrink-0 items-center border-b px-6">
          <h2 className="text-foreground text-sm font-semibold select-none">
            Recents
          </h2>
        </div>

        {/* Scrollable content */}
        <div className="flex h-full flex-1 flex-col gap-8 overflow-y-auto p-6 md:p-8">
          <NewDesignButton />

          <DesignLibrary
            ownedRooms={user.ownedRooms}
            invitedRooms={user.roomInvitations.map(
              (invitation) => invitation.room,
            )}
          />
        </div>

        {/* Copyright */}
        <footer className="border-border text-muted-foreground mt-auto border-t p-2 text-center text-xs select-none">
          &copy; {new Date().getFullYear()} KeepSerene.
        </footer>
      </section>
    </main>
  );
}

export default DashboardPage;
