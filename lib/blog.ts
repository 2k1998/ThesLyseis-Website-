// Server-only content layer: reads markdown posts from /content/blog, validates
// frontmatter, and renders sanitised HTML. Client components must import types
// and labels from "./blog-types" instead of this module.
import "server-only";

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

import {
  BLOG_CATEGORIES,
  type BlogCategory,
  type BlogPost,
  type BlogPostMeta,
} from "./blog-types";

export {
  BLOG_CATEGORIES,
  CATEGORY_LABELS,
  type BlogCategory,
  type BlogPost,
  type BlogPostMeta,
} from "./blog-types";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const SLUG_PATTERN = /^[a-z0-9-]+$/;
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const RAW_DATE_LINE_PATTERN =
  /^date:[ \t]*["']?(\d{4}-\d{2}-\d{2})["']?[ \t]*(?:#.*)?$/m;
const LOCAL_IMAGE_PATTERN = /^\/[A-Za-z0-9._/-]+\.(png|jpe?g|webp|avif|svg)$/;
const EXTERNAL_HREF_PATTERN = /^https?:\/\//i;
// Post images: absolute http(s) URLs or site-local paths (never "//host").
const IMAGE_SRC_PATTERN = /^(https?:\/\/|\/(?!\/))/i;
const IMAGE_DIMENSION_PATTERN = /^\d{1,5}$/;
const MAX_IMAGE_DIMENSION = 10000;
const WORDS_PER_MINUTE = 200;
// Real posts are a few KB; anything near this size is a mistake or an attack,
// and huge bodies can exhaust the markdown parser's call stack.
const MAX_POST_BYTES = 200 * 1024;

const TABLE_REGION_OPEN =
  '<div class="blog-table-wrap" role="region" aria-label="Πίνακας" tabindex="0"><table>';

type ParsedPost = { meta: BlogPostMeta; body: string };

// ---------------------------------------------------------------------------
// Frontmatter parsing
// ---------------------------------------------------------------------------

function disabledEngine(): never {
  throw new Error("frontmatter engine disabled");
}

// gray-matter evaluates `---js` / `---javascript` frontmatter with eval();
// both engines are replaced so only YAML (and inert JSON) can be parsed.
const MATTER_OPTIONS = {
  engines: { js: disabledEngine, javascript: disabledEngine },
};

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "unknown error";
}

function isCategory(value: unknown): value is BlogCategory {
  return (
    typeof value === "string" &&
    (BLOG_CATEGORIES as readonly string[]).includes(value)
  );
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== ""
    ? value.trim()
    : undefined;
}

/** True only for real calendar dates (rejects 2026-02-30, 2026-13-01, ...). */
function isRealCalendarDate(iso: string): boolean {
  const match = ISO_DATE_PATTERN.exec(iso);
  if (!match) return false;
  const [year, month, day] = [match[1], match[2], match[3]].map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * YAML turns `date: 2026-10-01` into a Date at UTC midnight (and silently rolls
 * 2026-02-30 over to 2026-03-02), so the literal written in the file is
 * compared against the parsed value to catch that rollover.
 */
function normalizeDate(
  value: unknown,
  rawFrontmatter: string,
): string | undefined {
  let iso: string | undefined;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return undefined;
    iso = value.toISOString().slice(0, 10);
    const literal = RAW_DATE_LINE_PATTERN.exec(rawFrontmatter)?.[1];
    if (literal !== undefined && literal !== iso) return undefined;
  } else if (typeof value === "string") {
    iso = value.trim();
  }

  return iso !== undefined && isRealCalendarDate(iso) ? iso : undefined;
}

function todayInAthens(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Athens",
  }).format(new Date());
}

function safeHttpUrl(value: unknown): string | undefined {
  const raw = asNonEmptyString(value);
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    const isHttp = url.protocol === "http:" || url.protocol === "https:";
    const hasCredentials = url.username !== "" || url.password !== "";
    return isHttp && !hasCredentials ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function safeLocalPath(value: unknown): string | undefined {
  const raw = asNonEmptyString(value);
  if (!raw) return undefined;
  const valid =
    LOCAL_IMAGE_PATTERN.test(raw) && !raw.startsWith("//") && !raw.includes("..");
  return valid ? raw : undefined;
}

function readingMinutes(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function parsePostFile(slug: string): ParsedPost | null {
  if (!SLUG_PATTERN.test(slug)) {
    console.warn(`[blog] skipping invalid slug: ${slug}`);
    return null;
  }
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);
    const { size } = fs.statSync(filePath);
    if (size > MAX_POST_BYTES) {
      console.warn(
        `[blog] skipping ${slug}: file too large (${size} bytes, max ${MAX_POST_BYTES})`,
      );
      return null;
    }
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content, matter: rawFrontmatter } = matter(
      raw,
      MATTER_OPTIONS,
    );
    const title = asNonEmptyString(data.title);
    const excerpt = asNonEmptyString(data.excerpt);
    const date = normalizeDate(data.date, rawFrontmatter);

    if (!title || !excerpt || !date || !isCategory(data.category)) {
      console.warn(`[blog] skipping ${slug}: invalid frontmatter`);
      return null;
    }

    return {
      body: content,
      meta: {
        slug,
        title,
        date,
        category: data.category,
        excerpt,
        cover: safeLocalPath(data.cover),
        sourceName: asNonEmptyString(data.sourceName),
        sourceUrl: safeHttpUrl(data.sourceUrl),
        readingMinutes: readingMinutes(content),
      },
    };
  } catch (error) {
    console.warn(
      `[blog] skipping ${slug}: unreadable file (${errorMessage(error)})`,
    );
    return null;
  }
}

function listSlugsOnDisk(): string[] {
  try {
    return fs
      .readdirSync(CONTENT_DIR)
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.slice(0, -3));
  } catch {
    return [];
  }
}

function compareNewestFirst(a: BlogPostMeta, b: BlogPostMeta): number {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1;
  return a.slug.localeCompare(b.slug);
}

// ---------------------------------------------------------------------------
// HTML rendering + sanitising
// ---------------------------------------------------------------------------

/**
 * Accepts only plain positive integers up to MAX_IMAGE_DIMENSION ("800", never
 * "800px", "-1", "0", "1e3" or "99999999"); anything else is dropped.
 */
function parseImageDimension(value: string | undefined): string | undefined {
  if (value === undefined || !IMAGE_DIMENSION_PATTERN.test(value)) {
    return undefined;
  }
  const parsed = Number(value);
  return parsed >= 1 && parsed <= MAX_IMAGE_DIMENSION
    ? String(parsed)
    : undefined;
}

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "strong",
    "em",
    "a",
    "blockquote",
    "code",
    "pre",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "hr",
    "br",
    "img",
  ],
  allowedAttributes: {
    a: ["href", "title", "rel", "target"],
    img: ["src", "alt", "title", "loading", "decoding", "width", "height"],
    pre: ["tabindex"],
    code: ["class"],
    th: ["align", "colspan", "rowspan"],
    td: ["align", "colspan", "rowspan"],
  },
  allowedClasses: { code: ["language-*"] },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: { img: ["http", "https"] },
  allowProtocolRelative: false,
  disallowedTagsMode: "discard",
  // An <img> whose src was rejected has nothing to show, so remove it.
  exclusiveFilter: (frame) => frame.tag === "img" && !frame.attribs.src,
  // Drop the *contents* of these tags too, not just the tags themselves.
  nonTextTags: [
    "script",
    "style",
    "textarea",
    "option",
    "iframe",
    "noscript",
    "object",
    "embed",
    "template",
  ],
  transformTags: {
    // The page template owns the single <h1>; keep the outline valid.
    h1: "h2",
    h5: "h4",
    h6: "h4",
    a: (tagName, attribs) => {
      const next: sanitizeHtml.Attributes = {};
      if (attribs.href !== undefined) next.href = attribs.href;
      if (attribs.title !== undefined) next.title = attribs.title;
      if (EXTERNAL_HREF_PATTERN.test(attribs.href ?? "")) {
        next.rel = "noopener noreferrer nofollow";
        next.target = "_blank";
      }
      return { tagName, attribs: next };
    },
    img: (tagName, attribs) => {
      const next: sanitizeHtml.Attributes = {
        loading: "lazy",
        decoding: "async",
      };
      if (attribs.src !== undefined && IMAGE_SRC_PATTERN.test(attribs.src)) {
        next.src = attribs.src;
      }
      if (attribs.alt !== undefined) next.alt = attribs.alt;
      if (attribs.title !== undefined) next.title = attribs.title;
      // Intrinsic size lets the browser reserve space and avoid layout shift.
      const width = parseImageDimension(attribs.width);
      const height = parseImageDimension(attribs.height);
      if (width !== undefined) next.width = width;
      if (height !== undefined) next.height = height;
      return { tagName, attribs: next };
    },
    pre: (tagName) => ({ tagName, attribs: { tabindex: "0" } }),
  },
};

/**
 * The sanitiser leaves <table> attribute-free, so wrapping it in a scrollable,
 * keyboard-focusable region afterwards cannot reintroduce untrusted markup.
 */
function wrapTables(html: string): string {
  return html
    .replace(/<table>/g, TABLE_REGION_OPEN)
    .replace(/<\/table>/g, "</table></div>");
}

/** Links whose unsafe href was stripped keep their text but lose the anchor. */
function unwrapDeadAnchors(html: string): string {
  return html.replace(/<a>([\s\S]*?)<\/a>/g, "$1");
}

function renderMarkdown(body: string): string {
  const rendered = marked.parse(body, { async: false, gfm: true });
  if (typeof rendered !== "string") {
    throw new TypeError("markdown renderer returned a non-string result");
  }
  const clean = sanitizeHtml(rendered, SANITIZE_OPTIONS);
  return wrapTables(unwrapDeadAnchors(clean));
}

// ---------------------------------------------------------------------------
// Public API (memoised per request by React cache)
// ---------------------------------------------------------------------------

export const getAllPosts = cache((): BlogPostMeta[] => {
  const today = todayInAthens();
  return listSlugsOnDisk()
    .map(parsePostFile)
    .filter((post): post is ParsedPost => post !== null)
    .map((post) => post.meta)
    .filter((meta) => meta.date <= today)
    .sort(compareNewestFirst);
});

export function getAllSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export const getPostBySlug = cache((slug: string): BlogPost | null => {
  const parsed = parsePostFile(slug);
  if (!parsed || parsed.meta.date > todayInAthens()) return null;
  // Deeply nested or pathological markdown can overflow the parser's stack;
  // one bad post must degrade to a 404, never break the build or other pages.
  try {
    return { ...parsed.meta, html: renderMarkdown(parsed.body) };
  } catch (error) {
    console.warn(
      `[blog] skipping ${slug}: render failed (${errorMessage(error)})`,
    );
    return null;
  }
});

export function getRelatedPosts(slug: string, limit = 3): BlogPostMeta[] {
  const all = getAllPosts();
  const current = all.find((post) => post.slug === slug);
  const others = all.filter((post) => post.slug !== slug);
  const sameCategory = others.filter(
    (post) => current !== undefined && post.category === current.category,
  );
  const rest = others.filter((post) => !sameCategory.includes(post));
  return [...sameCategory, ...rest].slice(0, limit);
}
