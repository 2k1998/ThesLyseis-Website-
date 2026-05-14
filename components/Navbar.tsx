import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-gray/20">
      <Container className="flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/logo.png"
            alt="Θες Λύσεις"
            width={48}
            height={48}
          />
        </Link>

        {/* Desktop Navigation Placeholder */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-black dark:text-neutral-gray">
          <Link
            href="/about"
            className="hover:text-primary dark:hover:text-white transition-colors"
          >
            Η Εταιρεία
          </Link>
          <Link
            href="/services"
            className="hover:text-primary dark:hover:text-white transition-colors"
          >
            Υπηρεσίες
          </Link>
          <Link
            href="/contact"
            className="hover:text-primary dark:hover:text-white transition-colors"
          >
            Επικοινωνία
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/free-check"
            className="hidden md:block bg-primary hover:bg-primary-light text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
          >
            Δωρεάν Έλεγχος
          </Link>
        </div>
      </Container>
    </nav>
  );
}
