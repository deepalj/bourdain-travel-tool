import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kitchen Confidential: Anthony Bourdain's Travel Tool",
  description: "An interactive, visually stunning journey documenting culinary adventures and travel insights inspired by Anthony Bourdain. Built with Next.js, Tailwind CSS, Supabase, and 3D Globe visualization.",
  keywords: ["Anthony Bourdain", "Travel Journal", "Culinary Adventures", "3D Globe", "Next.js", "Supabase", "React Portfolio"],
  authors: [{ name: "Engineering Student Portfolio" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-neutral-950 text-neutral-200 font-sans selection:bg-orange-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
