import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenCourt | Elite Pickup Basketball",
  description: "The elite platform for pickup basketball runs. Host games, join waitlists, and build your reliability score.",
  keywords: ["basketball", "pickup basketball", "sports", "games", "court finder", "basketball community"],
  authors: [{ name: "OpenCourt" }],
  openGraph: {
    title: "OpenCourt | Elite Pickup Basketball",
    description: "Find and join pickup basketball games near you. Build your reliability score and connect with the basketball community.",
    type: "website",
    siteName: "OpenCourt",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1F1D1D] text-[#F5EFEA] selection:bg-primary/30 min-h-screen`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

