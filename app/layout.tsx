import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CommandPalette } from "@/components/CommandPalette";
import { MotionProvider } from "@/components/MotionProvider";
import { SITE, indexingAllowed } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "This agent cuts drafting time by 42%. The firm should not deploy it. Yet. A deterministic scenario-rehearsal instrument that runs an AI workflow through a firm's fee model, incentives, review capacity, and talent system before anyone builds it.";


export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  /*
   * Off by default. The site reads named people's published positions, and
   * that should not surface in a search for their name because somebody
   * built a prototype about their work. app/robots.ts carries the reasoning.
   */
  robots: { index: indexingAllowed, follow: indexingAllowed },
  title: "Value Shift · AEC AI Economics Wind Tunnel",
  description: DESCRIPTION,
  /*
   * A site whose entire purpose is to be opened from a link had no link
   * preview at all, which meant it pasted into LinkedIn or an email as a bare
   * URL. The card itself is generated in app/opengraph-image.tsx from the
   * same engine the site runs on.
   */
  openGraph: {
    type: "website",
    siteName: "Value Shift",
    title: "The agent worked. The firm ended the month worse off.",
    description: DESCRIPTION,
    url: SITE,
  },
  twitter: {
    card: "summary_large_image",
    title: "The agent worked. The firm ended the month worse off.",
    description: DESCRIPTION,
  },
};

/** Matches the canvas, so mobile browser chrome does not flash white. */
export const viewport: Viewport = {
  themeColor: "#090a0f",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-canvas font-sans antialiased">
        <MotionProvider>
          {children}
          <CommandPalette />
        </MotionProvider>
      </body>
    </html>
  );
}
