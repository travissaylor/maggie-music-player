import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SONG } from "./constants";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${SONG.title} — ${SONG.artist}`,
  description: `Listen to ${SONG.title} by ${SONG.artist}`,
  openGraph: {
    title: SONG.title,
    description: `${SONG.title} by ${SONG.artist}`,
    images: [SONG.albumArt],
    type: "music.song",
  },
  twitter: {
    card: "summary_large_image",
    title: SONG.title,
    description: `${SONG.title} by ${SONG.artist}`,
    images: [SONG.albumArt],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
