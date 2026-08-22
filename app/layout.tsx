import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "After5 | Events & Experiences in Nairobi",
  description:
    "Discover the best events, nightlife, concerts, food, networking and experiences happening in Nairobi, Kenya.",
  keywords: [
    "Nairobi events",
    "events in Nairobi",
    "Nairobi nightlife",
    "things to do in Nairobi",
    "Nairobi concerts",
    "weekend events Nairobi",
    "Kenya events",
  ],
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