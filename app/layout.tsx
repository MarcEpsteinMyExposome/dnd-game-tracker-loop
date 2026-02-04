import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PersistenceProvider } from "@/components/layout/PersistenceProvider";
import { Navigation } from "@/components/layout/Navigation";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Bang Your Dead v3",
  description: "Western Gun & Magic Combat Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PersistenceProvider>
          {/* Navigation with Dice Roller */}
          <Navigation />

          {/* Main Content */}
          {children}
        </PersistenceProvider>
      </body>
    </html>
  );
}
