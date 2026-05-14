import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
