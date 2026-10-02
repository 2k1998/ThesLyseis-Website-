import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import BlogCard from "@/components/blog/BlogCard";
import BlogCover from "@/components/blog/BlogCover";
import { formatReadingTime } from "@/components/blog/format";
import { getAllSlugs, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { CATEGORY_LABELS, formatGreekDate } from "@/lib/blog-types";

export const revalidate = 3600;

const SITE_URL = "https://www.theslyseis.gr";

/** Separator is a decorative pseudo-element, so it never dangles at a wrapped row end. */
const BREADCRUMB_ITEM_CLASS =
  "flex items-center before:px-1.5 before:content-['/'] first:before:content-none";

const BREADCRUMB_LINK_CLASS =
  "inline-flex min-h-[44px] items-center rounded-sm font-medium text-primary underline-offset-4 transition-colors duration-300 hover:text-primary-light hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:text-primary-soft dark:hover:text-white";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

function absoluteUrl(path: string): string {
  return /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path}`;
}

function isHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

/** JSON for an inline <script>: escape characters that could close the tag. */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;
  const images = post.cover
    ? [{ url: absoluteUrl(post.cover), alt: post.title }]
    : undefined;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "el_GR",
      url,
      siteName: "Θες Λύσεις",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      section: CATEGORY_LABELS[post.category],
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      ...(images ? { images: images.map((image) => image.url) } : {}),
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getRelatedPosts(post.slug, 3);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const showSource = Boolean(post.sourceUrl && isHttpUrl(post.sourceUrl));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "el-GR",
    articleSection: CATEGORY_LABELS[post.category],
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    ...(post.cover ? { image: [absoluteUrl(post.cover)] } : {}),
    author: { "@type": "Organization", name: "Θες Λύσεις", url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "Θες Λύσεις",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Αρχική", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <main className="mt-16 w-full md:mt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }}
      />

      <article aria-labelledby="post-title" id="post">
        {/* Header */}
        <header className="relative overflow-hidden bg-background pb-8 pt-10 md:pb-12 md:pt-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-50"
            aria-hidden
            style={{
              background:
                "radial-gradient(circle at top, rgba(145, 83, 244, 0.12), transparent 55%)",
            }}
          />
          <Container className="relative z-10">
            <div className="mx-auto max-w-[720px]">
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex flex-wrap items-center text-sm text-foreground-muted">
                  <li className={BREADCRUMB_ITEM_CLASS}>
                    <Link href="/" className={BREADCRUMB_LINK_CLASS}>
                      Αρχική
                    </Link>
                  </li>
                  <li className={BREADCRUMB_ITEM_CLASS}>
                    <Link href="/blog" className={BREADCRUMB_LINK_CLASS}>
                      Blog
                    </Link>
                  </li>
                  <li className={`${BREADCRUMB_ITEM_CLASS} min-w-0`}>
                    <span
                      aria-current="page"
                      className="block max-w-[40ch] truncate py-3"
                      title={post.title}
                    >
                      {post.title}
                    </span>
                  </li>
                </ol>
              </nav>

              <span className="mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary dark:bg-primary-light/15 dark:text-primary-soft">
                {CATEGORY_LABELS[post.category]}
              </span>
              <h1
                id="post-title"
                className="mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-5xl"
              >
                {post.title}
              </h1>
              <p className="text-sm text-foreground-muted md:text-base">
                <time dateTime={post.date}>{formatGreekDate(post.date)}</time>
                <span aria-hidden> · </span>
                <span>{formatReadingTime(post.readingMinutes)}</span>
              </p>
            </div>
          </Container>
        </header>

        {/* Cover (decorative: the title is in the h1) */}
        <div className="bg-background pb-8 md:pb-12">
          <Container>
            <div className="mx-auto max-w-[960px] overflow-hidden rounded-2xl border border-card-border">
              <BlogCover
                category={post.category}
                cover={post.cover}
                alt=""
                priority
                compactFallback
              />
            </div>
          </Container>
        </div>

        {/* Body */}
        <div className="bg-background pb-12 md:pb-16">
          <Container>
            <div className="mx-auto max-w-[720px]">
              <div
                className="blog-prose"
                // Trusted, repo-authored markdown rendered at build time.
                dangerouslySetInnerHTML={{ __html: post.html }}
              />

              {showSource && (
                <p className="mt-10 border-t border-card-border pt-6 text-sm text-foreground-muted">
                  Πηγή:{" "}
                  <a
                    href={post.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="rounded-sm font-medium text-primary underline underline-offset-4 transition-colors duration-300 hover:text-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:text-primary-soft dark:hover:text-white"
                  >
                    {post.sourceName || post.sourceUrl}
                    <span className="sr-only"> (ανοίγει σε νέα καρτέλα)</span>
                  </a>
                </p>
              )}

              {/* In-article CTA */}
              <aside
                aria-labelledby="post-cta-title"
                className="mt-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary p-8 text-white shadow-lg shadow-primary/20 md:p-10"
              >
                <h2
                  id="post-cta-title"
                  className="mb-3 text-2xl font-bold leading-tight text-white md:text-3xl"
                >
                  Πληρώνετε περισσότερα απ&apos; όσα πρέπει;
                </h2>
                <p className="mb-6 max-w-xl text-white md:text-lg">
                  Αφήστε όνομα και τηλέφωνο και σας καλούμε εμείς. Ελέγχουμε τον
                  λογαριασμό σας δωρεάν, χωρίς δεσμεύσεις.
                </p>
                <Link
                  href="/free-check"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-primary shadow-md transition duration-300 hover:scale-[1.02] hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary motion-reduce:transition-none motion-reduce:hover:scale-100"
                >
                  Δωρεάν Έλεγχος
                </Link>
              </aside>
            </div>
          </Container>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section
          aria-labelledby="related-title"
          className="bg-background-secondary py-16 md:py-24"
        >
          <Container>
            <h2
              id="related-title"
              className="mb-10 text-2xl font-bold text-foreground md:text-4xl"
            >
              Σχετικά άρθρα
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.slug} post={item} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Back link */}
      <section className="bg-background py-12">
        <Container>
          <div className="mx-auto max-w-[720px] text-center">
            <Link
              href="/blog"
              className="group inline-flex min-h-[44px] items-center gap-1 rounded-sm text-base font-semibold text-primary transition-colors duration-300 hover:text-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light dark:text-primary-soft dark:hover:text-white"
            >
              <span
                aria-hidden
                className="transition-transform duration-300 group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              >
                ←
              </span>
              Όλα τα άρθρα
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
