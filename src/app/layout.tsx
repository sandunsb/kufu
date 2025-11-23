import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Inter,
  Ubuntu,
  Manrope,
  Playfair_Display,
  Libre_Baskerville,
  Nunito,
  Public_Sans
} from "next/font/google";
import SWRegister from '@/components/SWRegister';
import "./globals.css";

// --- Font Configurations ---
// Uncomment the one you want to use. 
// Make sure to only have ONE active at a time.

// 1. Geist (Default)
// const activeFont = Geist({ subsets: ["latin"], variable: "--font-main" });

// 2. Inter
//const activeFont = Inter({ subsets: ["latin"], variable: "--font-main" });

// 3. Ubuntu
// const activeFont = Ubuntu({ weight: ["300", "400", "500", "700"], subsets: ["latin"], variable: "--font-main" });

// 4. Ranade (Requires CDN link below)
// For Ranade, uncomment the <link> tag in the return statement and use a class or style if needed.
// Since we can't import it via next/font, we'll handle it differently or just use a fallback here if you want to test it.
// To test Ranade: Uncomment the link in the JSX and set font-family in globals.css manually to 'Ranade'.

// 5. Manrope
// const activeFont = Manrope({ subsets: ["latin"], variable: "--font-main" });

// 6. Playfair Display
// const activeFont = Playfair_Display({ subsets: ["latin"], variable: "--font-main" });

// 7. Libre Baskerville
const activeFont = Libre_Baskerville({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-main" });

// 8. Soria (Custom/Local)
// Not available on Google Fonts. You would need to add the font file to /public/fonts and use next/font/local.

// 9. Souvenir Std (Custom/Commercial)
// Not available on Google Fonts.

// 10. Nunito
// const activeFont = Nunito({ subsets: ["latin"], variable: "--font-main" });

// 11. Public Sans
// const activeFont = Public_Sans({ subsets: ["latin"], variable: "--font-main" });


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kufū 工夫 — Find Your Ingenious Rhythm",
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
        className={`${activeFont.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <SWRegister />
        {children}
      </body>
    </html>
  );
}
