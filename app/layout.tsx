import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/common/Footer";
import { TopNav } from "@/components/nav/TopNav";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "MidMarketBench", template: "%s | MidMarketBench" },
  description: "A synthetic benchmark for European lower-mid-market B2B software investment workflows.",
};

const themeScript = `(function(){try{var s=localStorage.getItem('mmb-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable}`}>
        <TopNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
