import Link from "next/link";
import BlogCover from "./BlogCover";
import { formatReadingTime } from "./format";
import {
  CATEGORY_LABELS,
  formatGreekDate,
  type BlogPostMeta,
} from "@/lib/blog-types";

interface BlogCardProps {
  post: BlogPostMeta;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const titleId = `blog-card-title-${post.slug}`;
  const layout = featured ? "flex flex-col lg:grid lg:grid-cols-2" : "flex flex-col";

  return (
    <Link
      href={`/blog/${post.slug}`}
      aria-labelledby={titleId}
      className={`group ${layout} overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
    >
      <BlogCover
        category={post.category}
        cover={post.cover}
        alt=""
        priority={featured}
        className={featured ? "lg:h-full lg:min-h-[320px] lg:aspect-auto" : ""}
      />
      <div className={`flex flex-1 flex-col p-6 ${featured ? "lg:justify-center lg:p-10" : ""}`}>
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary dark:bg-primary-light/15 dark:text-primary-soft">
            {CATEGORY_LABELS[post.category]}
          </span>
          <p className="text-foreground-muted">
            <time dateTime={post.date}>{formatGreekDate(post.date)}</time>
            <span aria-hidden> · </span>
            <span>{formatReadingTime(post.readingMinutes)}</span>
          </p>
        </div>
        <h3
          id={titleId}
          className={`mb-3 font-bold leading-snug text-foreground ${
            featured ? "line-clamp-4 text-2xl lg:text-3xl" : "line-clamp-2 text-xl"
          }`}
        >
          {post.title}
        </h3>
        <p
          className={`mb-5 leading-relaxed text-foreground-muted ${
            featured ? "line-clamp-4" : "line-clamp-3"
          }`}
        >
          {post.excerpt}
        </p>
        <span
          aria-hidden
          className={`inline-flex items-center gap-1 text-sm font-semibold text-primary dark:text-primary-soft ${
            featured ? "mt-4" : "mt-auto"
          }`}
        >
          Διαβάστε περισσότερα
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}
