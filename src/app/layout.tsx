import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne-base",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-base",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Social Media Planner",
  description: "Plan, preview, and schedule social media posts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${instrumentSans.variable} antialiased`}
      >
        <ConvexClientProvider>{children}</ConvexClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
