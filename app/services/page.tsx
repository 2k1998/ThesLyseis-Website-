import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Υπηρεσίες | Θες Λύσεις",
  description:
    "Σύγκριση παρόχων για ρεύμα, φυσικό αέριο και τηλεπικοινωνίες — χωρίς κόστος, χωρίς δεσμεύσεις. Δωρεάν έλεγχος και προσωπική καθοδήγηση.",
};

const howSteps = [
  { number: "01", title: "Μας καλείτε" },
  { number: "02", title: "Αναλύουμε τον λογαριασμό σας" },
  { number: "03", title: "Σας δίνουμε τη λύση" },
] as const;

function IconLightning() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-12 w-12 md:h-14 md:w-14"
      aria-hidden
    >
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function IconFlame() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-12 w-12 md:h-14 md:w-14"
      aria-hidden
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function IconSignal() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-12 w-12 md:h-14 md:w-14"
      aria-hidden
    >
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
      <path d="M22 4v16" />
    </svg>
  );
}

type ServiceBlock = {
  headline: string;
  icon: ReactNode;
  points: readonly string[];
  iconOnRight: boolean;
};

const services: readonly ServiceBlock[] = [
  {
    headline: "Ηλεκτρική Ενέργεια",
    icon: <IconLightning />,
    points: [
      "Συγκρίνουμε όλα τα διαθέσιμα τιμολόγια αγοράς",
      "Σας προτείνουμε το πρόγραμμα με βάση την κατανάλωσή σας",
      "Αναλαμβάνουμε τη διαδικασία αλλαγής παρόχου",
    ],
    iconOnRight: false,
  },
  {
    headline: "Φυσικό Αέριο",
    icon: <IconFlame />,
    points: [
      "Έλεγχος τιμολογίου και σύγκριση παρόχων",
      "Προτάσεις εξοικονόμησης βάσει κατανάλωσης",
      "Υποστήριξη σε όλη τη διαδικασία μετάβασης",
    ],
    iconOnRight: true,
  },
  {
    headline: "Τηλεπικοινωνίες",
    icon: <IconSignal />,
    points: [
      "Σύγκριση πακέτων σταθερής, κινητής και internet",
      "Εντοπισμός καλύτερης προσφοράς για τις ανάγκες σας",
      "Διαχείριση αλλαγής παρόχου χωρίς ταλαιπωρία",
    ],
    iconOnRight: false,
  },
];

export default async function ServicesPage() {
  return (
    <main className="w-full mt-16 md:mt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-black py-16 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle at center, rgba(145, 83, 244, 0.12), transparent 55%)",
          }}
        />
        <Container className="relative z-10">
          <div className="mx-auto max-w-[800px] text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-light">
              Τι κάνουμε
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              Τρεις αγορές. Μία λύση.
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-neutral-gray md:text-xl">
              Συγκρίνουμε τους παρόχους για εσάς και σας λέμε ποιος συμφέρει —
              χωρίς κόστος, χωρίς δεσμεύσεις.
            </p>
          </div>
        </Container>
      </section>

      {/* Services — alternating */}
      {services.map((service, index) => (
        <section
          key={service.headline}
          className={
            index % 2 === 0
              ? "bg-white py-16 dark:bg-black md:py-24"
              : "bg-zinc-50 py-16 dark:bg-black/50 md:py-24"
          }
        >
          <Container>
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
              <div
                className={`flex justify-center md:justify-start ${
                  service.iconOnRight ? "md:order-2 md:justify-end" : ""
                }`}
              >
                <div className="flex h-40 w-40 items-center justify-center rounded-2xl border-4 border-primary bg-primary/5 text-primary transition-colors duration-300 dark:bg-primary/10 md:h-48 md:w-48">
                  {service.icon}
                </div>
              </div>
              <div className={service.iconOnRight ? "md:order-1" : ""}>
                <h2 className="mb-6 text-3xl font-bold text-black dark:text-white md:text-4xl">
                  {service.headline}
                </h2>
                <ul className="mb-8 space-y-4">
                  {service.points.map((point) => (
                    <li key={point} className="flex gap-3 text-neutral-gray">
                      <span
                        className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full bg-primary-light"
                        aria-hidden
                      />
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-1 text-base font-semibold text-primary transition-colors duration-300 hover:text-primary-light"
                >
                  Κάντε δωρεάν έλεγχο
                  <span
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      ))}

      {/* How it works — condensed */}
      <section className="bg-white py-12 dark:bg-black md:py-16">
        <Container>
          <div className="relative">
            <div className="absolute left-[12%] right-[12%] top-[36px] -z-10 hidden h-[2px] bg-neutral-gray/20 dark:bg-neutral-gray/10 md:block" />

            <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-4">
              {howSteps.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-1 flex-col items-center text-center"
                >
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-primary bg-white text-xl font-bold text-primary shadow-sm dark:bg-black md:h-[5.5rem] md:w-[5.5rem] md:text-2xl">
                    {step.number}
                  </div>
                  <h3 className="max-w-[220px] text-base font-semibold text-black dark:text-white md:text-lg">
                    {step.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-16 dark:bg-primary/10 md:py-24">
        <Container>
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <h2 className="mb-10 text-3xl font-bold leading-tight text-black dark:text-white md:text-5xl">
              Έτοιμοι να εξοικονομήσετε;
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-10 py-4 text-lg font-medium text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02] hover:bg-primary-light"
            >
              Δωρεάν Έλεγχος
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
