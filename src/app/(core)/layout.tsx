import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./includes/header/page";
import "../globals.css";
import Footer from "./includes/footer/page";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OKPUJA | Book Hindu Puja & Astrology Services",
  description: "Platform to book all types of Hindu Puja and astrology services online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-[var(--foreground)]`}
      >
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
