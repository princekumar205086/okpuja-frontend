import type { Metadata } from "next";
import ToasterClient from "./ToasterClient";
import EmotionProvider from "./EmotionProvider";
import { LoadingProvider } from "./context/LoadingContext";
import "./globals.css";

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
    <html lang="en" className="dark">
      <body className="dark">
        <EmotionProvider>
          <LoadingProvider>
            {children}
            <ToasterClient />
          </LoadingProvider>
        </EmotionProvider>
      </body>
    </html>
  );
}