import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Petstan | Pakistan's Premium Pet Marketplace",
  description: "Buy and sell dogs, cats, birds, and other pets safely across Pakistan. Petstan is the #1 trusted marketplace for pet lovers with secure payments and verified sellers.",
  keywords: ["pets", "buy pets online", "dogs for sale", "cats for sale", "Pakistan pet market", "Petstan", "buy birds", "verified pet sellers"],
  authors: [{ name: "Faiz", url: "https://petstan.vercel.app" }],
  creator: "Petstan",
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://petstan.vercel.app",
    title: "Petstan | Pakistan's Premium Pet Marketplace",
    description: "Buy and sell pets safely across Pakistan. The #1 trusted marketplace for pet lovers.",
    siteName: "Petstan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Petstan | Pakistan's Premium Pet Marketplace",
    description: "Buy and sell pets safely across Pakistan.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
