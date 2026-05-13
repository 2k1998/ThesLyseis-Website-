import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import initAnalytics from "@/lib/analytics";
import AnalyticsInit from "@/components/AnalyticsInit";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AttributionInitializer from "@/components/growth/AttributionInitializer";
import ScrollTracker from "@/components/growth/ScrollTracker";
import StickyCTA from "@/components/StickyCTA";
import ScrollCTA from "@/components/ScrollCTA";
import ViberButton from "@/components/ViberButton";

const inter = Inter({ subsets: ["latin", "greek"] });

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

void initAnalytics;

export const metadata: Metadata = {
  title: "Θες Λύσεις | Προσωπικός Σύμβουλος Ενέργειας",
  description:
    "Παρακολουθούμε την αγορά για εσάς. Σας ενημερώνουμε μόνο όταν συμφέρει. Χωρίς κόστος.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'light') {
                  document.documentElement.classList.remove('dark');
                } else if (localStorage.getItem('theme') === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  if (window.matchMedia('(prefers-color-scheme: light)').matches) {
                    document.documentElement.classList.remove('dark');
                  }
                }
              } catch (_) {}
            `,
          }}
        />
        {GA4_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-gtag" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_MEASUREMENT_ID}');`}
            </Script>
          </>
        ) : null}
        {META_PIXEL_ID ? (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
            </Script>
            <noscript>
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        ) : null}
      </head>
      <body
        className={`${inter.className} antialiased bg-white dark:bg-black text-black dark:text-white transition-colors duration-400`}
      >
        <AnalyticsInit />
        <AttributionInitializer />
        <ScrollTracker />
        <Navbar />
        {children}
        <Footer />
        <StickyCTA />
        <ScrollCTA />
        <ViberButton />
      </body>
    </html>
  );
}
