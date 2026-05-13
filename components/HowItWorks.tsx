import Container from "./Container";

const steps = [
  {
    number: "01",
    title: "Καταχωρείτε τα στοιχεία σας",
  },
  {
    number: "02",
    title: "Ελέγχουμε την αγορά",
  },
  {
    number: "03",
    title: "Σας ενημερώνουμε όταν υπάρχει καλύτερη λύση",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-black">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white">
            Πώς λειτουργεί
          </h2>
        </div>

        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-[44px] left-[15%] right-[15%] h-[2px] bg-neutral-gray/20 dark:bg-neutral-gray/10 -z-10"></div>

          <div className="flex flex-col md:flex-row justify-between relative z-0 gap-12 md:gap-4">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                {/* Number Circle */}
                <div className="w-24 h-24 rounded-full bg-white dark:bg-black border-4 border-primary text-primary flex items-center justify-center text-3xl font-bold mb-6 shadow-sm">
                  {step.number}
                </div>
                {/* Step Title */}
                <h3 className="text-lg md:text-xl font-semibold text-center text-black dark:text-white max-w-[250px]">
                  {step.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
