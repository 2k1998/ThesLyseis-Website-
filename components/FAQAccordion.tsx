"use client";

import { useState } from "react";
import Container from "./Container";
import { cn } from "@/lib/utils";

const faqs = [
  {
    id: "faq-1",
    question: "Είναι πραγματικά δωρεάν η υπηρεσία;",
    answer:
      "Ναι, η υπηρεσία μας είναι εντελώς δωρεάν για εσάς. Αμειβόμαστε απευθείας από τους παρόχους σε περίπτωση που επιλέξετε να συνεργαστείτε μαζί τους μέσω εμάς.",
  },
  {
    id: "faq-2",
    question: "Πώς ξέρω ότι μου προτείνετε το καλύτερο;",
    answer:
      "Είμαστε ανεξάρτητοι σύμβουλοι. Η πλατφόρμα μας αναλύει αντικειμενικά τα δεδομένα της αγοράς με βάση το δικό σας ακριβές προφίλ κατανάλωσης, χωρίς καμία δέσμευση.",
  },
  {
    id: "faq-3",
    question: "Τι χρειάζεστε από εμένα για να ξεκινήσουμε;",
    answer:
      "Μόνο έναν πρόσφατο εκκαθαριστικό λογαριασμό ρεύματος. Αυτό μας επιτρέπει να δούμε ακριβώς την κατανάλωσή σας και τι πληρώνετε αυτή τη στιγμή.",
  },
];

export default function FAQAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-black">
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white mb-4">
              Συχνές Ερωτήσεις
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border border-black/10 dark:border-white/10 rounded-xl overflow-hidden bg-black/5 dark:bg-white/5"
                >
                  <button
                    type="button"
                    className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-primary/50"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`content-${faq.id}`}
                  >
                    <span className="font-semibold text-black dark:text-white text-lg">
                      {faq.question}
                    </span>
                    <span
                      className={cn(
                        "text-primary transition-transform duration-300",
                        isOpen ? "rotate-180" : "",
                      )}
                      aria-hidden="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </button>
                  <div
                    id={`content-${faq.id}`}
                    role="region"
                    aria-labelledby={faq.id}
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    <div className="px-6 pb-5 text-neutral-gray">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
