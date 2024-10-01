import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const ibmPlexMonoThinItalic = localFont({
  src: "./fonts/IBMPlexMono-ThinItalic.ttf",
  variable: "--font-ibm-plex-mono-thin-italic",
});
const ibmPlexMonoThin = localFont({
  src: "./fonts/IBMPlexMono-Thin.ttf",
  variable: "--font-ibm-plex-mono-thin",
});

export const metadata: Metadata = {
  title: "Subscription Calendar",
  description: "Track your subscriptions with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ibmPlexMonoThinItalic.variable} ${ibmPlexMonoThin.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}