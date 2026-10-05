"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";

type EventItem = {
  title: string;
  slug: string;
  category: string;
  categories: string[];
  location: string;
  date: string;
  time: string;
  price: string;
  image: string;
  description: string;
  ticketUrl: string;
  ticketProvider: string;
};

const categories = [
  "All Events",
  "Nightlife",
  "Music",
  "Networking",
  "Food ,Drinks and fun",
  "Campus",
];

const categorySlugs: Record<string, string> = {
  Nightlife: "nightlife",
  Music: "music",
  Networking: "networking",
  "Food ,Drinks and fun": "food-drink",
  Campus: "campus",
};

export default function Home() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Events");

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);

        const response = await fetch("/api/events");

        if (!response.ok) {
          throw new Error("Failed to load events");
        }

        const data = await response.json();

        const formattedEvents: EventItem[] = data.map((event: any) => {
          const date = new Date(`${event.event_date}T00:00:00`);

          const formattedDate = date.toLocaleDateString("en-KE", {
            weekday: "long",
            day: "numeric",
            month: "long",
          });

          const formattedTime = event.start_time
            ? new Date(
                `1970-01-01T${event.start_time}`
              ).toLocaleTimeString("en-KE", {
                hour: "numeric",
                minute: "2-digit",
              })
            : "Time TBA";

          const formattedPrice =
            event.price === null || event.price === undefined
              ? "Free"
              : Number(event.price) === 0
                ? "Free"
                : `${event.currency || "KES"} ${Number(
                    event.price
                  ).toLocaleString("en-KE")}`;

          return {
            title: event.title,
            slug: event.slug,
            category: event.category,
            categories: event.categories || [],
            location: event.location || event.venue || "Nairobi",
            date: formattedDate,
            time: formattedTime,
            price: formattedPrice,
            image:
              event.image_url ||
              "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=85",
            description: event.description || "",
            ticketUrl: event.ticket_url || "#",
            ticketProvider: event.ticket_provider || "Tickets",
          };
        });

        setEvents(formattedEvents);
      } catch (err) {
        console.error(err);
        setError("Unable to load events right now.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        !query ||
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All Events" ||
        event.categories?.includes(selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [events, search, selectedCategory]);

  const closeMenu = () => setMenuOpen(false);

  const scrollToEvents = () => {
    closeMenu();

    document.getElementById("events")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-8">
            <div className="h-16 w-16 rounded-full border border-[#C8A24C]/20" />

            <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border border-transparent border-t-[#C8A24C]" />
          </div>

          <p className="font-serif text-4xl font-semibold tracking-tight text-[#C8A24C]">
            After5
          </p>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-500">
            Nairobi&apos;s Experience Guide
          </p>

          <p className="mt-6 text-xs text-gray-600">
            Discovering what&apos;s happening...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main
      id="top"
      className="min-h-screen overflow-x-hidden bg-[#050505] text-white"
    >
      {/* NAVIGATION */}
      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
          <a
            href="#top"
            onClick={closeMenu}
            className="font-serif text-2xl font-bold tracking-tight text-[#C8A24C] sm:text-3xl"
          >
            After5
          </a>

          <div className="hidden items-center gap-8 text-sm md:flex">
            <a
              href="#events"
              className="transition hover:text-[#C8A24C]"
            >
              Events
            </a>

            <a
              href="#categories"
              className="transition hover:text-[#C8A24C]"
            >
              Categories
            </a>

            <a
              href="#about"
              className="transition hover:text-[#C8A24C]"
            >
              About
            </a>
          </div>

          <a
            href="#partner"
            className="hidden rounded-full border border-[#C8A24C] px-5 py-2 text-sm text-[#C8A24C] transition hover:bg-[#C8A24C] hover:text-black md:block"
          >
            Partner With Us
          </a>

          <button
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full border border-white/15 px-4 py-2 text-sm md:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#050505]/95 px-4 py-5 backdrop-blur-xl md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              <a
                href="#events"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-gray-300 transition hover:bg-white/5 hover:text-[#C8A24C]"
              >
                Events
              </a>

              <a
                href="#categories"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-gray-300 transition hover:bg-white/5 hover:text-[#C8A24C]"
              >
                Categories
              </a>

              <a
                href="#about"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-gray-300 transition hover:bg-white/5 hover:text-[#C8A24C]"
              >
                About
              </a>

              <a 
  href="https://docs.google.com/forms/d/e/1FAIpQLSfmJEAaqNLwIkY2Kp2XqP39l8z4r2KSsX01QZ0Wxons4hjkKg/viewform?usp=publish-editor"
  target="_blank"
  rel="noopener noreferrer"
  onClick={closeMenu} 
  className="mt-2 rounded-full bg-[#C8A24C] px-5 py-3 text-center font-medium text-black" 
> 
  List Your Event 
</a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <header
        id="hero"
        className="relative flex min-h-[92svh] items-end overflow-hidden px-4 pb-14 pt-24 sm:min-h-screen sm:px-6 sm:pb-20 lg:px-8"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/after5-nairobi-skyline.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.45)_35%,rgba(0,0,0,0.92)_100%)]" />

        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="max-w-4xl">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.32em] text-[#E0BC5A] sm:text-xs sm:tracking-[0.4em]">
              Nairobi&apos;s Experience Guide
            </p>

            <h1 className="max-w-4xl font-serif text-[3.25rem] font-semibold leading-[0.94] tracking-[-0.04em] sm:text-6xl md:text-8xl">
              Discover Nairobi
              <span className="block italic text-[#D6AE4E]">
                events & experiences.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-6 text-gray-200 sm:mt-8 sm:text-base sm:leading-7 md:text-lg">
              Discover the events, nightlife, music, food and experiences
              happening across Nairobi.
            </p>

            <div className="mt-7 flex w-full max-w-2xl flex-col gap-3 sm:mt-10 sm:flex-row">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                  ⌕
                </span>

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search events or places..."
                  className="min-h-14 w-full rounded-full border border-white/20 bg-black/45 pl-12 pr-5 text-sm text-white outline-none backdrop-blur-md placeholder:text-gray-400 focus:border-[#C8A24C]"
                  aria-label="Search Nairobi events"
                />
              </div>

              <button
                onClick={scrollToEvents}
                className="min-h-14 rounded-full bg-[#C8A24C] px-8 font-semibold text-black transition duration-300 hover:bg-[#E2C26B] active:scale-[0.98]"
              >
                Explore Events <span className="ml-2">→</span>
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:mt-8 sm:text-sm">
              <span className="text-gray-400">Trending:</span>

              {["Nightlife", "Music", "Networking"].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setSelectedCategory(item);
                    scrollToEvents();
                  }}
                  className="text-gray-200 underline-offset-4 transition hover:text-[#C8A24C] hover:underline"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-gray-400 md:block">
          Scroll to explore ↓
        </div>
      </header>

      {/* CATEGORIES */}
      <section
        id="categories"
        aria-labelledby="categories-heading"
        className="border-y border-white/10 bg-[#050505]/95 px-4 py-5 sm:px-6 sm:py-7 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <h2 id="categories-heading" className="sr-only">
            Browse Nairobi events by category
          </h2>

          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
            {categories.map((category) => {
              if (category === "All Events") {
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory("All Events")}
                    aria-pressed={selectedCategory === "All Events"}
                    className={`shrink-0 rounded-full border px-4 py-2.5 text-xs transition sm:px-5 sm:py-3 sm:text-sm ${
                      selectedCategory === "All Events"
                        ? "border-[#C8A24C] bg-[#C8A24C] text-black"
                        : "border-white/15 text-gray-300 hover:border-[#C8A24C] hover:text-[#C8A24C]"
                    }`}
                  >
                    {category}
                  </button>
                );
              }

              const slug = categorySlugs[category];

              return (
                <Link
                  key={category}
                  href={`/category/${slug}`}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-xs transition sm:px-5 sm:py-3 sm:text-sm ${
                    selectedCategory === category
                      ? "border-[#C8A24C] bg-[#C8A24C] text-black"
                      : "border-white/15 text-gray-300 hover:border-[#C8A24C] hover:text-[#C8A24C]"
                  }`}
                >
                  {category}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section
        id="events"
        aria-labelledby="events-heading"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
      >
        <div className="mb-8 flex items-end justify-between gap-4 sm:mb-12">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A24C] sm:text-xs">
              Explore Nairobi
            </p>

            <h2
              id="events-heading"
              className="font-serif text-3xl font-semibold sm:text-4xl md:text-5xl"
            >
              Upcoming Events in Nairobi
            </h2>
          </div>

          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All Events");
            }}
            className="hidden text-sm text-gray-400 transition hover:text-[#C8A24C] sm:block"
          >
            View all →
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {filteredEvents.length > 0 ? (
          <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <article
                key={event.slug}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0B0B0B] transition duration-300 hover:-translate-y-1 hover:border-[#C8A24C]/50"
              >
                <Link
                  href={`/events/${event.slug}`}
                  aria-label={`Explore ${event.title} in ${event.location}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={event.image}
                      alt={`${event.title} - ${event.category} event in Nairobi`}
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

                  <div className="mt-4 space-y-2 text-xs leading-5 text-gray-400 sm:text-sm">
                    <p>📍 {event.location}</p>
                    <p>📅 {event.date}</p>
                    <p>◷ {event.time}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                    <div>
                      <p className="text-[9px] uppercase tracking-wider text-gray-600">
                        From
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#C8A24C] sm:text-base">
                        {event.price}
                      </p>
                    </div>

                    <Link
                      href={`/events/${event.slug}`}
                      className="rounded-full border border-[#C8A24C]/60 px-4 py-2 text-xs font-medium transition hover:bg-[#C8A24C] hover:text-black sm:text-sm"
                    >
                      Explore <span className="ml-1">→</span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-16 text-center">
            <p className="font-serif text-2xl text-gray-200">
              No experiences found.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Try another search or category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All Events");
              }}
              className="mt-5 text-sm font-medium text-[#C8A24C] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* ORGANIZER CTA */}
      <section
        id="about"
        aria-labelledby="organizer-heading"
        className="relative overflow-hidden border-y border-white/10 px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-35"
          style={{
            backgroundImage: "url('/after5-nairobi-skyline.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-black/75" />

        <div className="relative mx-auto max-w-3xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C8A24C] sm:text-xs">
            For Event Organizers
          </p>

          <h2
            id="organizer-heading"
            className="mx-auto mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl"
          >
            Have an experience worth discovering?
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-gray-400 sm:text-base sm:leading-7">
            Get your event in front of people looking for their next
            experience in Nairobi.
          </p>

        <a
  id="partner"
  href="https://docs.google.com/forms/d/e/1FAIpQLSfmJEAaqNLwIkY2Kp2XqP39l8z4r2KSsX01QZ0Wxons4hjkKg/viewform?usp=publish-editor"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[#C8A24C] px-7 font-semibold text-black transition hover:bg-[#E2C26B]"
>
  List Your Event <span className="ml-2">→</span>
</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-center text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="font-serif text-xl font-semibold text-[#C8A24C]">
            After5
          </p>

          <p>Discover Nairobi. Experience more.</p>

          <p>© 2026 After5</p>
        </div>
      </footer>
    </main>
  );
}