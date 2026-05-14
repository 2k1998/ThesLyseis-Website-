import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Η Εταιρεία | Θες Λύσεις",
  description:
    "Από το 2019 βοηθάμε ιδιώτες και επιχειρήσεις στη Θεσσαλονίκη να πληρώνουν λιγότερο για ρεύμα, αέριο και τηλεπικοινωνίες — χωρίς κόστος για εσάς.",
};

const aboutStats = [
  { value: "5000+", label: "Πελάτες" },
  { value: "2019", label: "Από το" },
  { value: "0€", label: "Κόστος" },
] as const;

const valueCards = [
  {
    title: "Ανεξάρτητοι Σύμβουλοι",
    description:
      "Δεν ανήκουμε σε κανέναν πάροχο — δουλεύουμε αποκλειστικά για εσάς.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        className="h-7 w-7"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
        />
      </svg>
    ),
  },
  {
    title: "Χωρίς Κόστος",
    description:
      "Αμειβόμαστε από τους παρόχους όταν ολοκληρώνεται μια συμφωνία — ποτέ από εσάς.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        className="h-7 w-7"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Συνεχής Παρακολούθηση",
    description:
      "Σας ενημερώνουμε όταν υπάρχει καλύτερη επιλογή για το προφίλ σας.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
        className="h-7 w-7"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"
        />
      </svg>
    ),
  },
] as const;

export default async function AboutPage() {
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
              Ποιοι είμαστε
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl">
              Ο προσωπικός σας σύμβουλος ενέργειας.
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-neutral-gray md:text-xl">
              Από το 2019 βοηθάμε ιδιώτες και επιχειρήσεις στη Θεσσαλονίκη να
              πληρώνουν λιγότερο για ρεύμα, φυσικό αέριο και τηλεπικοινωνίες.
            </p>
          </div>
        </Container>
      </section>

      {/* Stats — TrustStrip style */}
      <section className="bg-white py-16 dark:bg-black md:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {aboutStats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center rounded-xl border border-black/10 bg-black/5 p-8 text-center dark:border-white/10 dark:bg-white/5"
              >
                <div className="mb-2 text-4xl font-bold text-primary dark:text-primary-soft md:text-5xl">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-neutral-gray md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Story */}
      <section className="bg-zinc-50 py-16 dark:bg-black/50 md:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="text-3xl font-bold leading-tight text-black dark:text-white md:text-4xl">
                Ξεκινήσαμε με μία απλή ιδέα.
              </h2>
            </div>
            <div className="space-y-5 text-neutral-gray leading-relaxed">
              <p>
                Ιδρύθηκε το 2019 στη Θεσσαλονίκη ως «Θες Ρεύμα», με στόχο να
                απλοποιήσουμε την επιλογή παρόχου ηλεκτρικής ενέργειας για
                νοικοκυριά και επιχειρήσεις.
              </p>
              <p>
                Το 2024 ανανεώσαμε την ταυτότητά μας σε «Θες Λύσεις», για να
                αντικατοπτρίζει καλύτερα τις υπηρεσίες μας πέρα από το ρεύμα —
                φυσικό αέριο και τηλεπικοινωνίες.
              </p>
              <p>
                Είμαστε μικρή ομάδα με προσωπική προσέγγιση: γνωρίζουμε τους
                πελάτες μας με το όνομά τους και τους συνοδεύουμε σε κάθε βήμα.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Value proposition */}
      <section className="bg-[#0a0a0a] py-16 md:py-24">
        <Container>
          <h2 className="mb-12 text-center text-3xl font-bold text-white md:mb-16 md:text-4xl">
            Γιατί να μας εμπιστευτείτε;
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
            {valueCards.map((card) => (
              <article
                key={card.title}
                className="rounded-xl border border-white/10 border-t-2 border-t-primary-light bg-white/[0.03] p-8 transition-colors duration-300 hover:border-white/15"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary-light transition-colors duration-300">
                  {card.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">
                  {card.title}
                </h3>
                <p className="leading-relaxed text-neutral-gray">
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA — CTASection style */}
      <section className="bg-primary/5 py-16 dark:bg-primary/10 md:py-24">
        <Container>
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <h2 className="mb-6 text-3xl font-bold leading-tight text-black dark:text-white md:text-5xl">
              Θέλετε να μάθετε αν πληρώνετε παραπάνω;
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
