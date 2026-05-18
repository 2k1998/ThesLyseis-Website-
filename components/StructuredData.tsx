const LOCAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Θες Λύσεις",
  description:
    "Σύμβουλος ενέργειας και τηλεπικοινωνιών. Συγκρίνουμε παρόχους ρεύματος, φυσικού αερίου και τηλεπικοινωνιών για ιδιώτες και επιχειρήσεις σε όλη την Ελλάδα. Δωρεάν υπηρεσία, χωρίς δεσμεύσεις.",
  url: "https://www.theslyseis.gr",
  telephone: "+302311825327",
  email: "info@theslyseis.gr",
  foundingDate: "2019",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Thessaloniki",
    addressCountry: "GR",
  },
  areaServed: {
    "@type": "Country",
    name: "Greece",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "17:00",
    },
  ],
} as const;

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(LOCAL_BUSINESS).replace(/</g, "\\u003c"),
      }}
    />
  );
}
