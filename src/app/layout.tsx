import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TravelGuide",
  description: "AI travel itinerary builder for multilingual trip planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
