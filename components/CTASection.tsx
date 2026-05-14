import Container from "./Container";

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-primary/5 dark:bg-primary/10">
      <Container>
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Σταματήστε να υπερπληρώνετε για ενέργεια.
          </h2>
          <p className="text-xl text-foreground-muted mb-10 max-w-2xl">
            Κάντε το πρώτο βήμα σήμερα. Ο έλεγχος είναι εντελώς δωρεάν και
            διαρκεί λιγότερο από 2 λεπτά.
          </p>
          <button
            type="button"
            className="bg-primary hover:bg-primary-light text-white font-medium rounded-xl px-10 py-4 text-lg hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-primary/20"
          >
            Ξεκινήστε Δωρεάν Έλεγχο
          </button>
        </div>
      </Container>
    </section>
  );
}
