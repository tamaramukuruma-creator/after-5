"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const categories = [
  "Nightlife",
  "Music",
  "Networking",
  "Food & Drink",
  "Campus",
];

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const eventId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Nightlife");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [venue, setVenue] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [ticketProvider, setTicketProvider] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState("draft");

  useEffect(() => {
    async function loadEvent() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setTitle(data.title || "");
      setCategory(data.category || "Nightlife");
      setDescription(data.description || "");
      setLocation(data.location || "");
      setVenue(data.venue || "");
      setEventDate(data.event_date || "");
      setStartTime(data.start_time?.slice(0, 5) || "");
      setEndTime(data.end_time?.slice(0, 5) || "");
      setPrice(data.price?.toString() || "");
      setTicketUrl(data.ticket_url || "");
      setTicketProvider(data.ticket_provider || "");
      setImageUrl(data.image_url || "");
      setFeatured(data.featured || false);
      setStatus(data.status || "draft");

      setLoading(false);
    }

    loadEvent();
  }, [eventId]);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSaving(true);

    const slug = createSlug(title);

    const { error } = await supabase
      .from("events")
      .update({
        title,
        slug,
        category,
        description,
        location,
        venue,
        event_date: eventDate,
        start_time: startTime || null,
        end_time: endTime || null,
        price: price ? Number(price) : null,
        ticket_url: ticketUrl || null,
        ticket_provider: ticketProvider || null,
        image_url: imageUrl || null,
        status,
        featured,
        updated_at: new Date().toISOString(),
      })
      .eq("id", eventId);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    router.push("/admin/events");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-white/60">Loading event...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">

        <div className="mb-10">
          <a
            href="/admin/events"
            className="text-sm text-white/50 hover:text-white"
          >
            ← Back to Events
          </a>

          <p className="mt-8 text-sm uppercase tracking-[0.3em] text-[#c8a24c]">
            After5
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Edit Event
          </h1>

          <p className="mt-2 text-sm text-white/60">
            Update the details of this After5 event.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Basic Information */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold">
              Basic Information
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Event Name
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#c8a24c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#c8a24c]"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="w-full resize-none rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#c8a24c]"
                />
              </div>

            </div>
          </section>

          {/* Date & Location */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold">
              Date & Location
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Event Date
                </label>

                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#c8a24c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Venue
                </label>

                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#c8a24c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Location / Area
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#c8a24c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Start Time
                </label>

                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#c8a24c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  End Time
                </label>

                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#c8a24c]"
                />
              </div>

            </div>
          </section>

          {/* Tickets */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold">
              Tickets
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Price (KES)
                </label>

                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#c8a24c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Ticket Provider
                </label>

                <input
                  type="text"
                  value={ticketProvider}
                  onChange={(e) => setTicketProvider(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#c8a24c]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-white/70">
                  Ticket Link
                </label>

                <input
                  type="url"
                  value={ticketUrl}
                  onChange={(e) => setTicketUrl(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#c8a24c]"
                />
              </div>

            </div>
          </section>

          {/* Image */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold">
              Event Image
            </h2>

            <div className="mt-6">
              <label className="mb-2 block text-sm text-white/70">
                Image URL
              </label>

              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#c8a24c]"
              />
            </div>
          </section>

          {/* Publishing */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-semibold">
              Publishing
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <label className="mb-2 block text-sm text-white/70">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-[#c8a24c]"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <label className="flex items-center gap-3 text-sm text-white/70">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 accent-[#c8a24c]"
                />

                Feature this event on After5
              </label>

            </div>
          </section>

          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

            <a
              href="/admin/events"
              className="rounded-xl border border-white/10 px-6 py-3 text-center text-sm text-white/70 hover:bg-white/10"
            >
              Cancel
            </a>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#c8a24c] px-6 py-3 font-semibold text-black transition hover:bg-[#e2c26b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}