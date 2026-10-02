import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const categorySlugs = [
  "nightlife",
  "music",
  "networking",
  "food-drink",
  "campus",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("slug, updated_at, event_date")
    .eq("status", "published")
    .order("event_date", { ascending: true });

  if (error) {
    console.error("Sitemap events error:", error);
  }

  const categoryUrls: MetadataRoute.Sitemap = categorySlugs.map(
    (category) => ({
      url: `${siteUrl}/category/${category}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    })
  );

  const eventUrls: MetadataRoute.Sitemap = (events ?? []).map((event) => ({
    url: `${siteUrl}/events/${event.slug}`,
    lastModified: event.updated_at
      ? new Date(event.updated_at)
      : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    ...categoryUrls,

    ...eventUrls,
  ];
}