import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Syne } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GVM - Global Visibility Marketplace",
  description: "Book visibility opportunities in podcasts, events, and media worldwide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${dmSans.variable} ${syne.variable} antialiased bg-athos-snow text-athos-navy`}>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}