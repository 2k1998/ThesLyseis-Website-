import Container from "./Container";

const services = [
  {
    title: "Ανάλυση Λογαριασμού",
    description:
      "Μελετάμε τις χρεώσεις σας και εντοπίζουμε κρυφά κόστη και ευκαιρίες εξοικονόμησης.",
  },
  {
    title: "Έρευνα Αγοράς",
    description:
      "Συγκρίνουμε όλα τα διαθέσιμα προγράμματα της αγοράς για το δικό σας προφίλ κατανάλωσης.",
  },
  {
    title: "Συνεχής Επιτήρηση",
    description:
      "Παρακολουθούμε τις εξελίξεις και σας ενημερώνουμε άμεσα όταν εμφανιστεί κάτι καλύτερο.",
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-16 md:py-24 bg-background-secondary">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Οι υπηρεσίες μας
          </h2>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Ολοκληρωμένες λύσεις διαχείρισης ενέργειας για το σπίτι ή την
            επιχείρησή σας.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card border border-card-border rounded-2xl p-8 hover:shadow-xl dark:hover:shadow-[0_20px_40px_rgba(255,255,255,0.05)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
            >
              {/* Purple top border accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 group-hover:bg-primary transition-colors duration-300"></div>

              <h3 className="text-2xl font-bold text-foreground mb-4 mt-2">
                {service.title}
              </h3>
              <p className="text-foreground-muted leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
