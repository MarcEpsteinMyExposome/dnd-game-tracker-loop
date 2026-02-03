import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { PersistenceProvider } from "@/components/layout/PersistenceProvider";
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
          {/* Navigation */}
          <nav className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-amber-100 shadow-lg border-b border-amber-900/50">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                <Link href="/" className="text-xl font-bold hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span className="text-2xl">🔫</span>
                  <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
                    Bang Your Dead
                  </span>
                </Link>
                <div className="flex gap-6">
                  <Link
                    href="/dashboard"
                    className="hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
                  >
                    <span className="text-sm">⭐</span> Dashboard
                  </Link>
                  <Link
                    href="/characters"
                    className="hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
                  >
                    <span className="text-sm">🤠</span> Characters
                  </Link>
                  <Link
                    href="/combat"
                    className="hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
                  >
                    <span className="text-sm">💥</span> Combat
                  </Link>
                  <Link
                    href="/monsters"
                    className="hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
                  >
                    <span className="text-sm">🦂</span> Outlaws
                  </Link>
                  <Link
                    href="/settings"
                    className="hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
                  >
                    <span className="text-sm">⚙️</span> Settings
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          {children}
        </PersistenceProvider>
      </body>
    </html>
  );
}
