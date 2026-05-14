import Container from "./Container";

const stats = [
  {
    value: "5000+",
    label: "Πελάτες",
  },
  {
    value: "2019",
    label: "Από το",
  },
  {
    value: "0€",
    label: "Κόστος για τον πελάτη",
  },
];

export default function TrustStrip() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-8 rounded-xl bg-card border border-card-border text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-primary dark:text-primary-soft mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-foreground-muted font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
