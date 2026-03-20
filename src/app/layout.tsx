import "~/styles/globals.css";
import { type Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

export const metadata: Metadata = {
  title: {
    template: "%s | Ocular",
    default: "Ocular",
  },
  description:
    "A high-performance design tool for the modern web. Focus on the craft. A distraction-free environment for visual builders.",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
