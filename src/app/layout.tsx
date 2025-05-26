import "./globals.css";
import { Playfair_Display, Inter } from "next/font/google";
import type { Metadata } from "next";

// Load Google Fonts with CSS variables
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// SEO metadata
export const metadata: Metadata = {
  title: "MV Hair Studio",
  description: "Expert in Non-Surgical Hair Transplantation – Look Your Best with Confidence.",
  icons: {
    icon: "/assets/favicon.png", // or "/favicon.png" if that's what you're using
  },
};

// Root layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
