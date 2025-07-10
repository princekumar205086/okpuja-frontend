import type { Metadata } from "next";
import ToasterClient from "./ToasterClient";
import EmotionProvider from "./EmotionProvider";
import { LoadingProvider } from "./context/LoadingContext";
import ThemeInitializer from "./components/ThemeInitializer";
import AppWrapper from "./components/AppWrapper";
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
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* Inline script to set initial theme class before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const mode = localStorage.getItem('theme') || 'light';
                if (mode === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.body.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  document.body.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        <ThemeInitializer />
        <EmotionProvider>
          <LoadingProvider>
            <AppWrapper>
              {children}
            </AppWrapper>
            <ToasterClient />
          </LoadingProvider>
        </EmotionProvider>
      </body>
    </html>
  );
}