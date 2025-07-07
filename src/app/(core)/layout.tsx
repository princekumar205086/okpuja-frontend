import type { Metadata } from "next";
import Header from "./includes/header/page";
import Footer from "./includes/footer/page";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
