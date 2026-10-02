"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Event = {
  id: string;
  title: string;
  category: string;
  location: string | null;
  event_date: string;
  status: "draft" | "published" | "archived";
};

export default function AdminEventsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/admin/login");
      return;
    }

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setEvents(data || []);
    setLoading(false);
  }

  async function handleDelete(id: string, title: string) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      setDeletingId(null);
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== id)
    );

    setDeletingId(null);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#c8a24c]">
              After5
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Events Dashboard
            </h1>

            <p className="mt-2 text-sm text-white/60">
              Manage the events displayed on After5.
            </p>
          </div>

          <a
            href="/admin/events/new"
            className="inline-flex items-center justify-center rounded-xl bg-[#c8a24c] px-5 py-3 font-semibold text-black transition hover:bg-[#e2c26b]"
          >
            + Add Event
          </a>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
            {error}
          </div>
        )}

        {/* Events */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">

          <div className="border-b border-white/10 px-5 py-4">
            <h2 className="font-medium">
              All Events ({events.length})
            </h2>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-white/60">
              Loading events...
            </div>
          ) : events.length > 0 ? (
            <div className="divide-y divide-white/10">

              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col gap-4 px-5 py-5 md:flex-row md:items-center md:justify-between"
                >

                  {/* Event information */}
                  <div>
                    <h3 className="font-medium">
                      {event.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/50">
                      <span>{event.category}</span>

                      <span>•</span>

                      <span>
                        {event.location || "Location not set"}
                      </span>

                      <span>•</span>

                      <span>{event.event_date}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">

                    {/* Status */}
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        event.status === "published"
                          ? "bg-green-500/10 text-green-300"
                          : event.status === "archived"
                            ? "bg-white/10 text-white/50"
                            : "bg-yellow-500/10 text-yellow-300"
                      }`}
                    >
                      {event.status}
                    </span>

                    {/* Edit */}
                    <a
                      href={`/admin/events/${event.id}/edit`}
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
                    >
                      Edit
                    </a>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(event.id, event.title)
                      }
                      disabled={deletingId === event.id}
                      className="rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === event.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>

                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="px-5 py-12 text-center">

              <p className="text-white/60">
                No events yet.
              </p>

              <a
                href="/admin/events/new"
                className="mt-4 inline-block text-sm text-[#c8a24c] hover:text-[#e2c26b]"
              >
                Add your first event →
              </a>

            </div>
          )}

        </div>
      </div>
    </main>
  );
}