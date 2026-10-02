import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import BlogGrid from "@/components/blog/BlogGrid";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 3600;

const TITLE = "Blog — Νέα Ενέργειας & Τηλεπικοινωνιών";
const DESCRIPTION =
  "Νέα και οδηγοί για ρεύμα, φυσικό αέριο και τηλεπικοινωνίες: τι αλλάζει στην αγορά, πώς διαβάζετε τον λογαριασμό σας και πώς να πληρώνετε λιγότερο.";

export function generateMetadata(): Metadata {
  const hasPosts = getAllPosts().length > 0;

  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "https://www.theslyseis.gr/blog" },
    // Avoid indexing an empty listing; links are still followed.
    ...(hasPosts ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      type: "website",
      locale: "el_GR",
      url: "https://www.theslyseis.gr/blog",
      siteName: "Θες Λύσεις",
      title: TITLE,
      description: DESCRIPTION,
    },
    twitter: {
      card: "summary",
      title: TITLE,
      description: DESCRIPTION,
    },
  };
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main className="mt-16 w-full md:mt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-background py-16 md:py-24">
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
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary dark:text-primary-soft">
              Blog
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              Νέα &amp; Οδηγοί Ενέργειας
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-foreground-muted md:text-xl">
              Τι αλλάζει στην αγορά ρεύματος, φυσικού αερίου και
              τηλεπικοινωνιών — εξηγημένο απλά, για να αποφασίζετε με
              σιγουριά.
            </p>
          </div>
        </Container>
      </section>

      {/* Posts */}
      <section className="bg-background pb-16 md:pb-24">
        <Container>
          <h2 className="sr-only">Άρθρα</h2>
          <BlogGrid posts={posts} />
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-16 dark:bg-primary/10 md:py-24">
        <Container>
          <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
            <h2 className="mb-4 text-3xl font-bold leading-tight text-foreground md:text-5xl">
              Έτοιμοι να εξοικονομήσετε;
            </h2>
            <p className="mb-10 max-w-xl text-lg text-foreground-muted">
              Αφήστε μας τον λογαριασμό σας και σας λέμε δωρεάν ποιος πάροχος
              συμφέρει.
            </p>
            <Link
              href="/free-check"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-10 py-4 text-lg font-medium text-white shadow-lg shadow-primary/20 transition duration-300 hover:scale-[1.02] hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none motion-reduce:hover:scale-100"
            >
              Δωρεάν Έλεγχος
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
