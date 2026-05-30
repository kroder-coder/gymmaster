import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/nav";

export const metadata: Metadata = {
  title: "GymMaster",
  description: "Track your gym workouts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-zinc-950 text-zinc-100 antialiased">
        <main className="max-w-lg mx-auto px-4 pt-6 pb-24 min-h-screen">
          {children}
        </main>
        <Nav />
      </body>
    </html>
  );
}
