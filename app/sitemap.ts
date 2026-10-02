import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://www.theslyseis.gr";

// Posts live in the repo, so adding one still needs a deploy. Revalidating
// hourly only lets a deployed post with a future date appear in the sitemap
// once that date arrives (Europe/Athens), without waiting for another deploy.
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    // The blog index is listed only once it has at least one post to show.
    ...(posts.length > 0
      ? [
          {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(posts[0].date),
            changeFrequency: "weekly" as const,
            priority: 0.8,
          },
        ]
      : []),
    ...posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
