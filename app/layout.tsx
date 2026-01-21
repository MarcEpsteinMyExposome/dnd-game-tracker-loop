import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "D&D Game Tracker Loop - v2.0",
  description: "Built using the RALPH loop methodology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Navigation */}
        <nav className="bg-gray-800 text-white shadow-lg">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
                🎲 D&D Game Tracker
              </Link>
              <div className="flex gap-6">
                <Link
                  href="/dashboard"
                  className="hover:text-gray-300 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/characters"
                  className="hover:text-gray-300 transition-colors font-medium"
                >
                  Characters
                </Link>
                {/* Future navigation links will go here (Combat, Monsters, etc.) */}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        {children}
      </body>
    </html>
  );
}
