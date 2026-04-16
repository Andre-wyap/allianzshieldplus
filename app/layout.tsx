import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://allianzshieldplus.com";

export const metadata: Metadata = {
  title: {
    default: "Allianz Shield Plus | Personal Accident Insurance Malaysia",
    template: "%s | Allianz Shield Plus",
  },
  description:
    "Comprehensive personal accident insurance with 19 primary benefits. Renewable up to age 80. Plans from RM 73/year. Distributed by WF Wealth Management Sdn Bhd.",
  keywords: [
    "personal accident insurance Malaysia",
    "Allianz Shield Plus",
    "PA insurance",
    "accident coverage Malaysia",
    "WF Wealth Management",
  ],
  metadataBase: new URL(appUrl),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_MY",
    url: "/",
    siteName: "Allianz Shield Plus",
    title: "Allianz Shield Plus | Personal Accident Insurance Malaysia",
    description:
      "19 primary benefits, renewable up to 80, plans from RM 73/year. Apply online in minutes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Allianz Shield Plus | Personal Accident Insurance Malaysia",
    description:
      "19 primary benefits, renewable up to 80, plans from RM 73/year. Apply online in minutes.",
  },
  robots: { index: true, follow: true },
};

const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}

        {/* ── Google Analytics 4 ── */}
        {ga4Id && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
            </Script>
          </>
        )}

        {/* ── Meta Pixel ── */}
        {pixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
          </Script>
        )}
      </body>
    </html>
  );
}
