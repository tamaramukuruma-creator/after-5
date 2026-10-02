import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

type Event = {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string | null;
  location: string | null;
  venue: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  price: number | null;
  currency: string | null;
  image_url: string | null;
  ticket_url: string | null;
  ticket_provider: string | null;
  status: string;
  featured: boolean;
  updated_at: string | null;
};

async function getEvent(slug: string): Promise<Event | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) {
    console.error("Event fetch error:", error);
    return null;
  }

  return data as Event;
}

function cleanDescription(description: string | null) {
  if (!description) {
    return "Discover this event in Nairobi with After5.";
  }

  return description.replace(/\s+/g, " ").trim().slice(0, 160);
}

function buildDateTime(
  date: string,
  time: string | null
): string {
  if (!time) {
    return `${date}T00:00:00+03:00`;
  }

  return `${date}T${time}+03:00`;
}

function formatEventDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-KE",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );
}

function formatEventTime(time: string | null) {
  if (!time) {
    return "Time TBA";
  }

  return new Date(`1970-01-01T${time}`).toLocaleTimeString(
    "en-KE",
    {
      hour: "numeric",
      minute: "2-digit",
    }
  );
}

function formatPrice(
  price: number | null,
  currency: string | null
) {
  if (price === null || price === undefined || Number(price) === 0) {
    return "Free";
  }

  return `${currency || "KES"} ${Number(price).toLocaleString(
    "en-KE"
  )}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);

  if (!event) {
    return {
      title: "Event Not Found | After5",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = cleanDescription(event.description);
  const eventUrl = `${siteUrl}/events/${event.slug}`;

  return {
    title: `${event.title} in Nairobi | After5`,
    description,

    alternates: {
      canonical: eventUrl,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: `${event.title} in Nairobi | After5`,
      description,
      url: eventUrl,
      siteName: "After5",
      locale: "en_KE",
      type: "website",
      images: event.image_url
        ? [
            {
              url: event.image_url,
              width: 1600,
              height: 900,
              alt: event.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: `${event.title} in Nairobi | After5`,
      description,
      images: event.image_url
        ? [event.image_url]
        : undefined,
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await getEvent(slug);

  if (!event) {
    notFound();
  }

  const image =
    event.image_url ||
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=90";

  const eventUrl = `${siteUrl}/events/${event.slug}`;

  const formattedDate = formatEventDate(event.event_date);

  const formattedTime = formatEventTime(event.start_time);

  const formattedPrice = formatPrice(
    event.price,
    event.currency
  );

  const startDate = buildDateTime(
    event.event_date,
    event.start_time
  );

  const endDate =
    event.end_time
      ? buildDateTime(
          event.event_date,
          event.end_time
        )
      : undefined;

  /*
   * Event JSON-LD
   *
   * This helps search engines understand that this page
   * represents a real event.
   */
  const eventStructuredData = {
    "@context": "https://schema.org",
    "@type": "Event",

    name: event.title,

    description: cleanDescription(event.description),

    startDate,

    ...(endDate ? { endDate } : {}),

    eventStatus:
      "https://schema.org/EventScheduled",

    eventAttendanceMode:
      "https://schema.org/OfflineEventAttendanceMode",

    url: eventUrl,

    image: [image],

    location: {
      "@type": "Place",
      name:
        event.venue ||
        event.location ||
        "Nairobi",

      address: {
        "@type": "PostalAddress",
        addressLocality:
          event.location || "Nairobi",
        addressRegion: "Nairobi County",
        addressCountry: "KE",
      },
    },

    organizer: {
      "@type": "Organization",
      name: "After5",
      url: siteUrl,
    },

    ...(event.ticket_url
      ? {
          offers: {
            "@type": "Offer",
            url: event.ticket_url,

            ...(event.price !== null &&
            event.price !== undefined
              ? {
                  price: Number(event.price),
                }
              : {}),

            priceCurrency:
              event.currency || "KES",

            availability:
              "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <>
      {/* Event structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            eventStructuredData
          ),
        }}
      />

      <main className="min-h-screen bg-[#050505] text-white">
        {/* Back */}
        <div className="mx-auto max-w-7xl px-6 pt-8">
          <Link
            href="/"
            className="text-sm text-white/60 transition hover:text-[#E0BC5A]"
          >
            ← Back to events
          </Link>
        </div>

        {/* Hero */}
        <section className="mx-auto mt-8 max-w-7xl px-6">
          <div className="relative h-[420px] overflow-hidden rounded-3xl">
            <img
              src={image}
              alt={event.title}
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/45" />

            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-[#E0BC5A]">
                {event.category}
              </p>

              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight md:text-6xl">
                {event.title}
              </h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1fr_360px]">
          {/* Description */}
          <div>
            <h2 className="mb-5 text-2xl font-semibold">
              About this event
            </h2>

            <p className="max-w-3xl text-lg leading-8 text-white/70">
              {event.description ||
                "More information coming soon."}
            </p>
          </div>

          {/* Event details */}
          <aside className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
            <div className="space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-white/40">
                  Date
                </p>

                <p className="mt-1 text-lg">
                  {formattedDate}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-white/40">
                  Time
                </p>

                <p className="mt-1 text-lg">
                  {formattedTime}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-white/40">
                  Location
                </p>

                <p className="mt-1 text-lg">
                  {event.location ||
                    event.venue ||
                    "Nairobi"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-white/40">
                  Price
                </p>

                <p className="mt-1 text-lg text-[#E0BC5A]">
                  {formattedPrice}
                </p>
              </div>

              {event.ticket_url ? (
                <a
                  href={event.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-full bg-[#E0BC5A] px-6 py-4 text-center font-semibold text-black transition hover:bg-[#f0d17d]"
                >
                  Get Tickets
                </a>
              ) : (
                <div className="rounded-full border border-white/10 px-6 py-4 text-center font-semibold text-white/50">
                  Tickets coming soon
                </div>
              )}

              <p className="text-center text-xs text-white/40">
                {event.ticket_provider ||
                  "Tickets"}
              </p>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}