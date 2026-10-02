"use client";

import { useMemo, useState } from "react";
import BlogCard from "./BlogCard";
import {
  BLOG_CATEGORIES,
  CATEGORY_LABELS,
  type BlogCategory,
  type BlogPostMeta,
} from "@/lib/blog-types";

type Filter = "all" | BlogCategory;

interface BlogGridProps {
  posts: readonly BlogPostMeta[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const availableCategories = useMemo(
    () => BLOG_CATEGORIES.filter((c) => posts.some((p) => p.category === c)),
    [posts],
  );

  const visible = useMemo(
    () => (filter === "all" ? posts : posts.filter((p) => p.category === filter)),
    [posts, filter],
  );

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-card-border bg-card px-6 py-16 text-center">
        <p className="mb-2 text-xl font-semibold text-foreground">
          Σύντομα νέα άρθρα
        </p>
        <p className="text-foreground-muted">
          Ετοιμάζουμε νέα και οδηγούς για ρεύμα, φυσικό αέριο και
          τηλεπικοινωνίες. Ξανακοιτάξτε σύντομα.
        </p>
      </div>
    );
  }

  const [featured, ...rest] = visible;
  const chips: ReadonlyArray<{ value: Filter; label: string }> = [
    { value: "all", label: "Όλα" },
    ...availableCategories.map((c) => ({ value: c, label: CATEGORY_LABELS[c] })),
  ];

  const countLabel = `${visible.length} ${visible.length === 1 ? "άρθρο" : "άρθρα"}`;

  return (
    <div>
      <p role="status" className="sr-only">
        {countLabel}
      </p>
      <div className="mb-10 flex flex-wrap gap-3" role="group" aria-label="Φίλτρο κατηγορίας">
        {chips.map((chip) => {
          const active = filter === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(chip.value)}
              className={`min-h-[44px] rounded-full border px-5 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-light ${
                active
                  ? "border-primary bg-primary text-white"
                  : "border-card-border bg-card text-foreground hover:border-primary-light"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {featured && (
        <div className="mb-8">
          <BlogCard post={featured} featured />
        </div>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
