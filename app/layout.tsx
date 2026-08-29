import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CommandPalette } from "@/components/CommandPalette";
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

/**
 * Where the site lives, for the absolute URLs a link preview needs.
 *
 * Vercel sets the production hostname itself, so the deployed build is
 * correct without anyone remembering to configure it. The explicit variable
 * wins when there is a custom domain, and localhost is the honest fallback
 * for a build that has not been deployed anywhere yet.
 */
const SITE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-canvas font-sans antialiased">
        {children}
        <CommandPalette />
      </body>
    </html>
  );
}
