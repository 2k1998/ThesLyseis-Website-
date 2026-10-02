import type { ReactNode } from "react";
import type { BlogCategory } from "@/lib/blog-types";

const ICON_CLASS = "h-14 w-14 md:h-16 md:w-16";

const ICONS: Record<BlogCategory, ReactNode> = {
  electricity: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLASS} aria-hidden>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  gas: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLASS} aria-hidden>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  ),
  telecom: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLASS} aria-hidden>
      <path d="M2 20h.01" />
      <path d="M7 20v-4" />
      <path d="M12 20v-8" />
      <path d="M17 20V8" />
      <path d="M22 4v16" />
    </svg>
  ),
  news: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={ICON_CLASS} aria-hidden>
      <path d="M4 5h13v14H6a2 2 0 0 1-2-2V5z" />
      <path d="M17 9h3v8a2 2 0 0 1-2 2" />
      <path d="M8 9h5M8 13h5" />
    </svg>
  ),
};

interface BlogCoverProps {
  category: BlogCategory;
  cover?: string;
  alt: string;
  /** Above-the-fold image: eager + high fetch priority. */
  priority?: boolean;
  /** Use a slimmer 21:9 ratio for the generated (no-image) fallback only. */
  compactFallback?: boolean;
  className?: string;
}

export default function BlogCover({
  category,
  cover,
  alt,
  priority = false,
  compactFallback = false,
  className = "",
}: BlogCoverProps) {
  if (cover) {
    return (
      <div className={`relative aspect-video w-full overflow-hidden bg-background-secondary ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          {...({ fetchpriority: priority ? "high" : "auto" } as Record<string, string>)}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={`relative flex ${compactFallback ? "aspect-[21/9]" : "aspect-video"} w-full items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-light text-white ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 80% 20%, rgba(214,197,240,0.55), transparent 55%)",
        }}
      />
      <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        {ICONS[category]}
      </div>
    </div>
  );
}
