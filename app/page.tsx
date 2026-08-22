const events = [
  {
    title: "Amapiano Nights",
    category: "NIGHTLIFE",
    location: "K1 Klub House",
    date: "FRI • 8:00 PM",
    price: "KES 1,500",
  },
  {
    title: "Nairobi Jazz Experience",
    category: "MUSIC",
    location: "The Alchemist",
    date: "SAT • 7:00 PM",
    price: "KES 2,000",
  },
  {
    title: "Creative Networking Night",
    category: "NETWORKING",
    location: "Westlands",
    date: "SAT • 6:30 PM",
    price: "FREE",
  },
];

const categories = [
  "All Events",
  "Nightlife",
  "Music",
  "Networking",
  "Food & Drink",
  "Campus",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      
      {/* NAVIGATION */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#050505]/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <a href="#" className="text-2xl font-bold tracking-tight text-[#C8A24C]">
            After5
          </a>

          <div className="hidden items-center gap-8 text-sm md:flex">
            <a href="#events" className="text-white transition hover:text-[#C8A24C]">
              Events
            </a>
            <a href="#categories" className="text-white transition hover:text-[#C8A24C]">
              Categories
            </a>
            <a href="#about" className="text-white transition hover:text-[#C8A24C]">
              About
            </a>
          </div>

          <button className="rounded-full border border-[#C8A24C] px-5 py-2 text-sm text-[#C8A24C] transition hover:bg-[#C8A24C] hover:text-black">
            Partner With Us
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex min-h-screen items-center justify-center px-5 pt-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-5 text-sm font-medium uppercase tracking-[0.35em] text-[#C8A24C]">
            Nairobi's Experience Guide
          </p>

          <h1 className="text-5xl font-semibold leading-tight tracking-tight sm:text-6xl md:text-8xl">
            Discover
            <span className="block font-serif italic text-[#C8A24C]">
              What's Happening
            </span>
            After5.
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-gray-400 md:text-lg">
            Discover the best events, nightlife, music, food and experiences
            happening across Nairobi.
          </p>

          {/* SEARCH */}
          <div className="mx-auto mt-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search events, places or experiences..."
              className="min-h-14 flex-1 rounded-full border border-white/10 bg-white/5 px-6 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#C8A24C]"
            />

            <button className="min-h-14 rounded-full bg-[#C8A24C] px-8 font-medium text-black transition hover:bg-[#E2C26B]">
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="border-y border-white/10 px-5 py-8">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto pb-2">
          {categories.map((category, index) => (
            <button
              key={category}
              className={`whitespace-nowrap rounded-full border px-5 py-3 text-sm transition ${
                index === 0
                  ? "border-[#C8A24C] bg-[#C8A24C] text-black"
                  : "border-white/10 text-gray-400 hover:border-[#C8A24C] hover:text-[#C8A24C]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-[#C8A24C]">
              This Week
            </p>

            <h2 className="text-3xl font-semibold md:text-5xl">
              Trending Experiences
            </h2>
          </div>

          <a
            href="#"
            className="hidden text-sm text-gray-400 transition hover:text-[#C8A24C] sm:block"
          >
            View all →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.title}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0D0D0D] transition duration-300 hover:-translate-y-1 hover:border-[#C8A24C]/50"
            >
              {/* IMAGE PLACEHOLDER */}
              <div className="flex aspect-[4/3] items-end bg-gradient-to-br from-[#1d1d1d] via-[#111111] to-[#080808] p-5">
                <span className="rounded-full border border-[#C8A24C]/50 px-3 py-1 text-xs tracking-wider text-[#C8A24C]">
                  {event.category}
                </span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold">{event.title}</h3>

                <div className="mt-5 space-y-2 text-sm text-gray-400">
                  <p>📍 {event.location}</p>
                  <p>◷ {event.date}</p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-sm font-medium text-[#C8A24C]">
                    {event.price}
                  </span>

                  <button className="text-sm text-white transition group-hover:text-[#C8A24C]">
                    Explore →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        id="about"
        className="border-y border-white/10 bg-[#0A0A0A] px-5 py-24 text-center"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-[#C8A24C]">
          For Event Organizers
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold md:text-6xl">
          Have an experience worth discovering?
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-gray-400">
          Get your event in front of people looking for their next experience
          in Nairobi.
        </p>

        <button className="mt-8 rounded-full bg-[#C8A24C] px-8 py-4 font-medium text-black transition hover:bg-[#E2C26B]">
          List Your Event
        </button>
      </section>

      {/* FOOTER */}
      <footer className="px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p className="text-lg font-semibold text-[#C8A24C]">After5</p>

          <p>
            Discover Nairobi. Experience more.
          </p>

          <p>© 2026 After5</p>
        </div>
      </footer>
    </main>
  );
}