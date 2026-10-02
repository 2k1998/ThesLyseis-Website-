export type BlogCategory = "electricity" | "gas" | "telecom" | "news";

export const BLOG_CATEGORIES: readonly BlogCategory[] = [
  "electricity",
  "gas",
  "telecom",
  "news",
];

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  electricity: "Ρεύμα",
  gas: "Φυσικό Αέριο",
  telecom: "Τηλεπικοινωνίες",
  news: "Νέα Αγοράς",
};

export interface BlogPostMeta {
  slug: string;
  title: string;
  date: string;
  category: BlogCategory;
  excerpt: string;
  cover?: string;
  sourceName?: string;
  sourceUrl?: string;
  readingMinutes: number;
}

export interface BlogPost extends BlogPostMeta {
  html: string;
}

const GREEK_MONTHS = [
  "Ιανουαρίου",
  "Φεβρουαρίου",
  "Μαρτίου",
  "Απριλίου",
  "Μαΐου",
  "Ιουνίου",
  "Ιουλίου",
  "Αυγούστου",
  "Σεπτεμβρίου",
  "Οκτωβρίου",
  "Νοεμβρίου",
  "Δεκεμβρίου",
] as const;

/** "2026-10-01" -> "1 Οκτωβρίου 2026" (no timezone shifts). */
export function formatGreekDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const monthName = GREEK_MONTHS[month - 1];
  if (!year || !day || !monthName) return isoDate;
  return `${day} ${monthName} ${year}`;
}
