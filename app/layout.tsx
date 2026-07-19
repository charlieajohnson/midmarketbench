import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Footer } from "@/components/common/Footer";
import { TopNav } from "@/components/nav/TopNav";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal"],
  weight: ["400", "500"],
});
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "MidMarketBench", template: "%s | MidMarketBench" },
  description: "Observed frontier-model benchmarking for European lower-mid-market B2B software investment workflows.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body className={`${newsreader.variable} ${geistSans.variable} ${geistMono.variable}`}>
        <TopNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
