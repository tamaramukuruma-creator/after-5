import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "After5 | Events & Experiences in Nairobi",
    template: "%s | After5",
  },

  description:
    "Discover events, nightlife, concerts, food, networking and experiences happening in Nairobi, Kenya.",

  keywords: [
    "Nairobi events",
    "events in Nairobi",
    "Nairobi events this weekend",
    "things to do in Nairobi",
    "things to do in Nairobi tonight",
    "Nairobi nightlife",
    "Nairobi concerts",
    "Nairobi parties",
    "Nairobi networking events",
    "campus events Nairobi",
    "Kenya events",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "After5 | Events & Experiences in Nairobi",
    description:
      "Discover events, nightlife, concerts, food, networking and experiences happening in Nairobi, Kenya.",
    type: "website",
    locale: "en_KE",
    siteName: "After5",
    url: "/",
  },

  twitter: {
    card: "summary_large_image",
    title: "After5 | Events & Experiences in Nairobi",
    description:
      "Discover events, nightlife, concerts, food, networking and experiences happening in Nairobi, Kenya.",
  },

  robots: {
    index: true,
    follow: true,
  },
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