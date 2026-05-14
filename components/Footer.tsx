import Container from "./Container";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-neutral-gray/20 py-12 md:py-16">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-foreground-muted">
            &copy; {new Date().getFullYear()} Θες Λύσεις. All rights reserved.
          </div>
          <div className="text-sm text-foreground-muted">
            Designed for Trust & Growth.
          </div>
        </div>
      </Container>
    </footer>
  );
}
