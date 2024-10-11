import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Definimos la fuente Circular, similar a la utilizada por Spotify
const circularStd = localFont({
  src: './fonts/CircularStd-Book.ttf',
  variable: '--font-circular-std',
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
        className={`${circularStd.variable} font-sans antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}