import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Create a design room",
    description: `Sign in and open your dashboard. Hit "New design" to spin up a fresh room — it's live in seconds.`,
  },
  {
    number: "02",
    title: "Build on the canvas",
    description:
      "Add rectangles, ellipses, text, and freehand paths. Move, resize, style, and layer them exactly how you want.",
  },
  {
    number: "03",
    title: "Invite and collaborate",
    description:
      "Share your room with teammates by email. Everyone joins the same live canvas — cursors, selections, and all.",
  },
];

function StepCard({ step }: { step: Step }) {
  const { number, title, description } = step;

  return (
    <li className="flex flex-col items-start gap-4">
      {/* Number badge */}
      <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold">
        {number}
      </div>

      <div>
        <h3 className="text-foreground mb-2 text-base font-semibold">
          {title}
        </h3>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </li>
  );
}

export const HowItWorks = () => (
  <section id="how-it-works" className="bg-sidebar py-28">
    <div className="mx-auto max-w-6xl px-6">
      {/* Section header */}
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <p className="text-primary mb-3 text-[0.65rem] font-semibold tracking-[0.14em] uppercase">
          Getting started
        </p>

        <h2 className="text-foreground mb-4 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          Up and running in minutes
        </h2>

        <p className="text-muted-foreground text-base leading-relaxed">
          No plugins. No downloads. Just open your browser and start building.
        </p>
      </div>

      {/* Steps */}
      <ol
        className="relative grid grid-cols-1 gap-8 md:grid-cols-3"
        role="list"
      >
        {steps.map((step) => (
          <StepCard key={step.number} step={step} />
        ))}
      </ol>

      {/* CTA */}
      <div className="mt-16 text-center">
        <Link
          href="/sign-in"
          className="bg-primary text-primary-foreground inline-flex h-11 items-center gap-2 rounded-[calc(var(--radius)-1px)] px-7 text-sm font-semibold transition-all duration-150 hover:opacity-90 focus-visible:opacity-90 focus-visible:outline-none active:scale-[0.98]"
        >
          Focus your vision
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  </section>
);

export default HowItWorks;
