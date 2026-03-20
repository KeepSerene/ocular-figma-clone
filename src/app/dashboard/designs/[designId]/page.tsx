import type { Metadata } from "next";
import { auth } from "~/server/auth";
import Room from "~/components/liveblocks/Room";
import Canvas from "~/components/canvas/Canvas";

export const metadata: Metadata = {
  title: "Design",
};

type DesignPageProps = Promise<{ designId: string }>;

// Liveblocks room page
async function DesignPage({ params }: { params: DesignPageProps }) {
  const { designId } = await params;
  const session = await auth();

  return (
    <Room roomId={`room:${designId}`}>
      <Canvas />
    </Room>
  );
}

export default DesignPage;
