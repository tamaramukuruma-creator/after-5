import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const categories = {
  nightlife: {
    name: "Nightlife",
    description:
      "Discover the best nightlife events, parties, club nights and late-night experiences happening in Nairobi.",
  },
  music: {
    name: "Music",
    description:
      "Discover concerts, live music, DJ sets, festivals and music experiences happening across Nairobi.",
  },
  networking: {
    name: "Networking",
    description:
      "Find networking events, professional meetups, creative gatherings and business events happening in Nairobi.",
  },
  "food-drink": {
    name: "Food & Drink",
    description:
      "Discover food experiences, restaurant events, tastings, brunches and drink experiences happening in Nairobi.",
  },
  campus: {
    name: "Campus",
    description:
      "Discover campus events, student experiences, university gatherings and activities happening in Nairobi.",
  },
} as const;

type CategorySlug = keyof typeof categories;

type Event = {
  title: string;
  slug: string;
  category: string;
  location: string | null;
  venue: string | null;
  event_date: string;
  start_time: string | null;
  price: number | null;
  currency: string | null;
  image_url: string | null;
  description: string | null;
};

function getCategory(
  category: string
): (typeof categories)[CategorySlug] | null {
  return categories[category as CategorySlug] || null;
}

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTime(time: string | null) {
  if (!time) return "Time TBA";

  return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-KE", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatPrice(
  price: number | null,
  currency: string | null
) {
  if (price === null || price === undefined || Number(price) === 0) {
    return "Free";
  }

  return `${currency || "KES"} ${Number(price).toLocaleString("en-KE")}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;

  const categoryInfo = getCategory(category);

  if (!categoryInfo) {
    return {
      title: "Events in Nairobi | After5",
      description:
        "Discover events and experiences happening across Nairobi with After5.",
    };
  }

  return {
    title: `${categoryInfo.name} Events in Nairobi | After5`,
    description: categoryInfo.description,
    alternates: {
      canonical: `${siteUrl}/category/${category}`,
    },
    openGraph: {
      title: `${categoryInfo.name} Events in Nairobi | After5`,
      description: categoryInfo.description,
      url: `${siteUrl}/category/${category}`,
      siteName: "After5",
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const categoryInfo = getCategory(category);

  if (!categoryInfo) {
    notFound();
  }

  const supabase = await createClient();

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .eq("category", categoryInfo.name)
    .order("event_date", { ascending: true })
    .order("start_time", { ascending: true });

  if (error) {
    console.error("Category events error:", error);
  }

  const eventList = (events || []) as Event[];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Link
            href="/"
            className="text-sm text-white/60 transition hover:text-[#E0BC5A]"
          >
            ← Back to After5
          </Link>

          <div className="mt-12 max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A24C]">
              Nairobi Events
            </p>

            <h1 className="mt-4 font-serif text-5xl font-semibold tracking-tight md:text-7xl">
              {categoryInfo.name} Events in Nairobi
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
              {categoryInfo.description}
            </p>
          </div>
        </div>
      </header>

      {/* CATEGORY NAVIGATION */}
      <nav
        aria-label="Event categories"
        className="border-b border-white/10"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-5">
          {Object.entries(categories).map(([slug, info]) => (
            <Link
              key={slug}
              href={`/category/${slug}`}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-sm transition ${
                slug === category
                  ? "border-[#C8A24C] bg-[#C8A24C] text-black"
                  : "border-white/15 text-white/60 hover:border-[#C8A24C] hover:text-[#C8A24C]"
              }`}
            >
              {info.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* EVENTS */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-10">
          <p className="text-sm text-white/40">
            {eventList.length}{" "}
            {eventList.length === 1 ? "event" : "events"} found
          </p>

          <h2 className="mt-2 font-serif text-3xl font-semibold md:text-4xl">
            Upcoming {categoryInfo.name} Experiences
          </h2>
        </div>

        {eventList.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventList.map((event) => {
              const image =
                event.image_url ||
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85";

              return (
                <article
                  key={event.slug}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0B] transition duration-300 hover:-translate-y-1 hover:border-[#C8A24C]/50"
                >
                  <Link
                    href={`/events/${event.slug}`}
                    aria-label={`Explore ${event.title}`}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={image}
                        alt={`${event.title} - ${categoryInfo.name} event in Nairobi`}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                      <span className="absolute left-4 top-4 rounded-full border border-[#C8A24C]/60 bg-black/65 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#E0BC5A] backdrop-blur-md">
                        {event.category}
                      </span>
                    </div>
                  </Link>

                  <div className="p-5 sm:p-6">
                    <h3 className="font-serif text-xl font-semibold tracking-tight transition-colors group-hover:text-[#C8A24C] sm:text-2xl">
                      <Link href={`/events/${event.slug}`}>
                        {event.title}
                      </Link>
                    </h3>

                    <div className="mt-4 space-y-2 text-sm leading-5 text-gray-400">
                      <p>
                        📍 {event.location || event.venue || "Nairobi"}
                      </p>

                      <p>📅 {formatDate(event.event_date)}</p>

                      <p>◷ {formatTime(event.start_time)}</p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <p className="text-sm font-semibold text-[#C8A24C]">
                        {formatPrice(event.price, event.currency)}
                      </p>

                      <Link
                        href={`/events/${event.slug}`}
                        className="rounded-full border border-[#C8A24C]/60 px-4 py-2 text-sm font-medium transition hover:bg-[#C8A24C] hover:text-black"
                      >
                        Explore →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-20 text-center">
            <h2 className="font-serif text-3xl text-white">
              No {categoryInfo.name.toLowerCase()} events yet.
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/50">
              We&apos;re adding more Nairobi experiences. Check back soon or
              explore another category.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-[#C8A24C] px-6 py-3 font-semibold text-black transition hover:bg-[#E2C26B]"
            >
              Explore all events
            </Link>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-center text-xs text-gray-500 md:flex-row md:items-center md:justify-between md:text-left">
          <p className="font-serif text-xl font-semibold text-[#C8A24C]">
            After5
          </p>

          <p>Discover Nairobi. Experience more.</p>

          <Link
            href="/"
            className="transition hover:text-[#C8A24C]"
          >
            Back to all events
          </Link>
        </div>
      </footer>
    </main>
  );
}