import type { Metadata } from "next";
import {
  Libre_Baskerville
} from "next/font/google";
import SWRegister from '@/components/SWRegister';
import "./globals.css";

const activeFont = Libre_Baskerville({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-main" });

export const metadata: Metadata = {
  title: "Pomodrive - Pomodoro Timer | Study Work Productivity",
  description: "A minimal pomodoro timer for deep work.",
  manifest: '/manifest.json',
};
export const viewport = {
  themeColor: '#10b981',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Uncomment for Ranade */}
        <link href="https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${activeFont.variable} antialiased font-sans`}
      >
        <SWRegister />
        {children}
      </body>
    </html>
  );
}
