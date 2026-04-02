import type { Metadata } from "next";
import { auth } from "~/server/auth";
import Nav from "~/components/landing/Nav";
import Hero from "~/components/landing/Hero";
import Features from "~/components/landing/Features";
import HowItWorks from "~/components/landing/HowItWorks";
import Footer from "~/components/landing/Footer";

export const metadata: Metadata = {
  title: {
    absolute: "Ocular — Design in Focus",
  },
  description:
    "A high-performance collaborative SVG canvas for the modern web. Draw shapes, add text, sketch freehand — and build with your team in real time.",
};

async function LandingPage() {
  const session = await auth();
  const isAuthenticated = Boolean(session);

  return (
    <main className="overflow-hidden">
      <Nav isAuthenticated={isAuthenticated} />
      <Hero isAuthenticated={isAuthenticated} />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
}

export default LandingPage;
