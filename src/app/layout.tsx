import type { Metadata } from "next";
import Script from 'next/script';
import { Libre_Baskerville } from "next/font/google";
import SWRegister from "@/components/SWRegister";
import "./globals.css";

const activeFont = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-main",
});

export const metadata: Metadata = {
  title: "Pomodrive - Pomodoro Timer | Study Work Productivity",
  description: "A minimal pomodoro timer for deep work.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-N6LHCLHR');
            `,
          }}
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=ranade@300,400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className={`${activeFont.variable} antialiased font-sans`}>
        {/* Google Tag Manager – noscript part */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N6LHCLHR"
                      height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />

        <SWRegister />
        {children}
      </body>
    </html>
  );
}