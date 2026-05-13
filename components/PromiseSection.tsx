import Container from "./Container";

const promises = [
  {
    title: "Δεν πληρώνετε τίποτα",
    description: "Η υπηρεσία μας είναι και θα παραμείνει 100% δωρεάν για εσάς.",
  },
  {
    title: "Δεν δεσμεύεστε",
    description:
      "Είστε ελεύθεροι να επιλέξετε ή να απορρίψετε οποιαδήποτε πρόταση.",
  },
  {
    title: "Παρακολουθούμε την αγορά κάθε μήνα",
    description:
      "Αναλύουμε συνεχώς τις τιμές για να σας προσφέρουμε την καλύτερη λύση.",
  },
];

export default function PromiseSection() {
  return (
    <section className="py-16 md:py-24 bg-zinc-50 dark:bg-black/50">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {promises.map((promise, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              {/* Icon Placeholder (Circle SVG) */}
              <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-6 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-black dark:text-white mb-3">
                {promise.title}
              </h3>
              <p className="text-neutral-gray leading-relaxed">
                {promise.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
