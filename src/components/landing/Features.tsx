import {
  MousePointer2,
  Shapes,
  Layers,
  SlidersHorizontal,
  Users2,
  UserPlus2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Users2,
    title: "Live Collaboration",
    description:
      "See every cursor, selection, and edit as teammates work alongside you. Powered by Liveblocks for zero-latency presence.",
  },
  {
    icon: MousePointer2,
    title: "Precision SVG Canvas",
    description:
      "A pixel-perfect, infinite canvas built on native SVG. Smooth zooming, panning, and sub-pixel rendering out of the box.",
  },
  {
    icon: Shapes,
    title: "Rich Shape Tools",
    description:
      "Rectangles, ellipses, freehand pencil paths, and text layers — all fully editable with granular style controls.",
  },
  {
    icon: Layers,
    title: "Layer Management",
    description:
      "A live-updating panel shows your full layer stack. Click to select, net-drag to multi-select, and reorder freely.",
  },
  {
    icon: SlidersHorizontal,
    title: "Live Property Controls",
    description:
      "Adjust position, dimensions, fill, stroke, opacity, corner radius, and typography on any layer — in real time.",
  },
  {
    icon: UserPlus2,
    title: "Room Sharing",
    description:
      "Invite collaborators to your design rooms by email. Full undo history, keyboard shortcuts, and access control included.",
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  const { icon: Icon, title, description } = feature;

  return (
    <li
      tabIndex={0}
      className="group border-border bg-card hover:border-primary/30 focus-within:border-primary/30 rounded-xl border p-6 transition-all duration-200 focus-within:shadow-md focus-within:outline-none hover:shadow-md"
    >
      <div
        style={{
          backgroundColor: "oklch(0.6716 0.1368 48.5130 / 0.08)",
        }}
        className="mb-5 flex size-10 items-center justify-center rounded-lg"
      >
        <Icon className="text-primary size-5" strokeWidth={1.75} />
      </div>

      <h3 className="text-foreground mb-2 text-sm font-semibold">{title}</h3>

      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </li>
  );
}

const Features = () => (
  <section id="features" className="bg-background py-28">
    <div className="mx-auto max-w-6xl px-6">
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <p className="text-primary mb-3 text-[0.65rem] font-semibold tracking-[0.14em] uppercase">
          What&apos;s inside
        </p>

        <h2 className="text-foreground mb-4 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          Everything you need to design
        </h2>

        <p className="text-muted-foreground text-base leading-relaxed">
          Ocular is built around a focused, distraction-free workflow. Every
          feature earns its place.
        </p>
      </div>

      <ul
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        role="list"
      >
        {features.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </ul>
    </div>
  </section>
);

export default Features;
