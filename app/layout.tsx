import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AnalyticsInit from "@/components/AnalyticsInit";
import CookieBanner from "@/components/CookieBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AttributionInitializer from "@/components/growth/AttributionInitializer";
import ScrollTracker from "@/components/growth/ScrollTracker";
import StickyCTA from "@/components/StickyCTA";
import ScrollCTA from "@/components/ScrollCTA";
import ViberButton from "@/components/ViberButton";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin", "greek"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.theslyseis.gr"),
  title: {
    default: "Θες Λύσεις | Σύμβουλος Ενέργειας & Τηλεπικοινωνιών",
    template: "%s | Θες Λύσεις",
  },
  description:
    "Συγκρίνουμε παρόχους ρεύματος, φυσικού αερίου και τηλεπικοινωνιών για ιδιώτες και επιχειρήσεις σε όλη την Ελλάδα. Δωρεάν υπηρεσία, χωρίς δεσμεύσεις.",
  keywords: [
    "σύμβουλος ενέργειας",
    "σύγκριση παρόχων ρεύματος",
    "φθηνότερο ρεύμα",
    "αλλαγή παρόχου",
    "φυσικό αέριο",
    "τηλεπικοινωνίες",
  ],
  authors: [{ name: "Θες Λύσεις" }],
  creator: "Θες Λύσεις",
  openGraph: {
    type: "website",
    locale: "el_GR",
    url: "https://www.theslyseis.gr",
    siteName: "Θες Λύσεις",
    title: "Θες Λύσεις | Σύμβουλος Ενέργειας & Τηλεπικοινωνιών",
    description:
      "Συγκρίνουμε παρόχους ρεύματος, φυσικού αερίου και τηλεπικοινωνιών για ιδιώτες και επιχειρήσεις σε όλη την Ελλάδα. Δωρεάν υπηρεσία, χωρίς δεσμεύσεις.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Θες Λύσεις — Σύμβουλος Ενέργειας & Τηλεπικοινωνιών",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Θες Λύσεις | Σύμβουλος Ενέργειας & Τηλεπικοινωνιών",
    description:
      "Συγκρίνουμε παρόχους ρεύματος, φυσικού αερίου και τηλεπικοινωνιών για ιδιώτες και επιχειρήσεις σε όλη την Ελλάδα. Δωρεάν, χωρίς δεσμεύσεις.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.theslyseis.gr",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" className="dark">
      <head>
        <StructuredData />
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
        className={`${inter.className} antialiased bg-background text-foreground transition-colors duration-400`}
      >
        <AnalyticsInit />
        <CookieBanner />
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
