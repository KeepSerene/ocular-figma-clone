import "~/styles/globals.css";
import { type Metadata } from "next";
import { Inter, Open_Sans } from "next/font/google";
import { env } from "~/env";

export const metadata: Metadata = {
  // Required for Next.js to resolve relative URLs in OG/Twitter image fields
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    template: "%s | Ocular",
    default: "Ocular — Design in Focus",
  },
  description:
    "A high-performance collaborative design tool for the modern web. Draw shapes, sketch freehand, add text — and build with your team in real time on a shared SVG canvas.",
  keywords: [
    "design tool",
    "collaborative design",
    "SVG editor",
    "vector editor",
    "real-time collaboration",
    "figma alternative",
    "online whiteboard",
    "multiplayer canvas",
    "web design app",
    "freehand drawing",
  ],
  authors: [{ name: "Dhrubajyoti Bhattacharjee" }],
  creator: "Dhrubajyoti Bhattacharjee",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Ocular",
    title: "Ocular — Design in Focus",
    description:
      "A high-performance collaborative design tool for the modern web. Draw shapes, sketch freehand, add text — and build with your team in real time on a shared SVG canvas.",
    images: [
      {
        url: "/ocular-banner.webp",
        width: 1200,
        height: 634,
        alt: "Ocular — Design in Focus",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ocular — Design in Focus",
    description:
      "A high-performance collaborative design tool for the modern web. Draw shapes, sketch freehand, add text — and build with your team in real time on a shared SVG canvas.",
    creator: "@UsualLearner",
    images: ["/ocular-banner.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  icons: [{ rel: "icon", url: "/favicon.svg", type: "image/svg+xml" }],
};

// Global font
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Needed for text layers on canvas
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${openSans.variable} ${inter.variable}`}>
      <body className="selection:bg-primary/15 selection:text-white">
        {children}
      </body>
    </html>
  );
}
