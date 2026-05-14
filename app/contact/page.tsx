import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import Container from "@/components/Container";

export const metadata: Metadata = {
  title: "Επικοινωνία | Θες Λύσεις",
  description:
    "Συμπληρώστε τη φόρμα ή επικοινωνήστε τηλεφωνικά, μέσω Viber ή email. Δωρεάν έλεγχος και προσωπική καθοδήγηση.",
};

function IconPhone() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0 text-primary-light"
      aria-hidden
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconViber() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0 text-primary-light"
      aria-hidden
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0 text-primary-light"
      aria-hidden
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 shrink-0 text-primary-light"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <main className="w-full mt-16 md:mt-20">
      <section className="relative overflow-hidden bg-black py-12 md:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          aria-hidden
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(87, 39, 163, 0.25), transparent 50%)",
          }}
        />
        <Container className="relative z-10">
          <div className="mx-auto max-w-[800px] text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-light">
              Επικοινωνία
            </p>
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
              Μιλήστε με έναν σύμβουλο σήμερα.
            </h1>
            <p className="mx-auto max-w-2xl text-base text-neutral-gray md:text-lg">
              Συμπληρώστε τη φόρμα ή επικοινωνήστε μαζί μας απευθείας. Η υπηρεσία
              μας είναι δωρεάν.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-zinc-50 py-16 dark:bg-black/50 md:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-12 lg:gap-14">
            <div className="md:col-span-7">
              <ContactForm embedded />
            </div>

            <aside className="md:col-span-5">
              <div className="sticky top-24 rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 shadow-lg transition-shadow duration-300 md:top-28">
                <h2 className="mb-8 text-xl font-bold text-white md:text-2xl">
                  Στοιχεία Επικοινωνίας
                </h2>

                <ul className="space-y-6">
                  <li>
                    <a
                      href="tel:+302311825327"
                      className="flex gap-3 text-neutral-gray transition-colors duration-300 hover:text-white"
                    >
                      <IconPhone />
                      <span className="leading-snug">
                        <span className="block text-xs font-medium uppercase tracking-wide text-neutral-gray/80">
                          Τηλέφωνο
                        </span>
                        <span className="text-base font-semibold text-white">
                          2311825327
                        </span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="viber://chat?number=%2B306932642952"
                      className="flex gap-3 text-neutral-gray transition-colors duration-300 hover:text-white"
                    >
                      <IconViber />
                      <span className="leading-snug">
                        <span className="block text-xs font-medium uppercase tracking-wide text-neutral-gray/80">
                          Viber
                        </span>
                        <span className="text-base font-semibold text-white">
                          +30 693 264 2952
                        </span>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:info@theslyseis.gr"
                      className="flex gap-3 text-neutral-gray transition-colors duration-300 hover:text-white"
                    >
                      <IconMail />
                      <span className="leading-snug">
                        <span className="block text-xs font-medium uppercase tracking-wide text-neutral-gray/80">
                          Email
                        </span>
                        <span className="text-base font-semibold text-white break-all">
                          info@theslyseis.gr
                        </span>
                      </span>
                    </a>
                  </li>
                </ul>

                <div className="mt-8 flex gap-3 border-t border-white/10 pt-8 text-sm text-neutral-gray">
                  <IconClock />
                  <p className="leading-relaxed">
                    Δευτέρα – Παρασκευή, 9:00 – 17:00
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </main>
  );
}
