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

export const metadata: Metadata = {
  title: "Value Shift · AEC AI Economics Wind Tunnel",
  description:
    "This agent is 42% faster. The firm should not deploy it. Yet. A deterministic scenario-rehearsal instrument that runs an AI workflow through a firm's fee model, incentives, review capacity, and talent system before anyone builds it.",
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
