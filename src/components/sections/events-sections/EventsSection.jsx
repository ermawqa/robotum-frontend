import { useState, useMemo, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import * as assets from "@assets";
import Button from "@components/ui/Button";
import ImageFrame from "@components/ui/ImageFrame";
import { ENUM_TYPES, fetchEvents } from "@data";
import { formatEventDateRange } from "@utils/date-range";
import { useAsyncData } from "@hooks/useAsyncData";
import { useEnumOptions } from "@hooks/useEnumOptions";

export default function EventsSection() {
  // Category chips come from the Supabase event_category enum.
  const { options: categoryOptions } = useEnumOptions(
    ENUM_TYPES.EVENT_CATEGORY,
  );

  const [activeCategory, setActiveCategory] = useState("All");

  // Map a chip label back to the DB event.category value.
  const normalizeCategory = useCallback(
    (label) => {
      if (!label || label === "All") return "All";
      const match = categoryOptions.find(
        (opt) => opt.label === label || opt.value === label,
      );
      // fall back to label if no match (defensive)
      return match?.value || label;
    },
    [categoryOptions],
  );

  // If the enum changed in the DB, drop a chip selection that no longer exists.
  useEffect(() => {
    if (activeCategory === "All") return;
    const stillExists = categoryOptions.some(
      (opt) => opt.label === activeCategory || opt.value === activeCategory,
    );
    if (!stillExists) setActiveCategory("All");
  }, [categoryOptions, activeCategory]);
  const [timeframe, setTimeframe] = useState("All"); // 'All' | 'Upcoming' | 'Past'
  const {
    data: events,
    loading,
    error: errorMsg,
  } = useAsyncData(fetchEvents, [], {
    initialData: [],
    errorMessage: "Failed to load events. Please try again later.",
  });

  const { hash } = useLocation();

  // Scroll to hash if present
  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    }
  }, [hash]);

  // Derived lists (filter + sort)
  const { filteredEvents, counts } = useMemo(() => {
    const now = new Date();
    const normalized = normalizeCategory(activeCategory);

    const inCategory = (e) => normalized === "All" || e.category === normalized;

    const isUpcoming = (e) => new Date(e.end_at || e.start_at) >= now;

    const isPast = (e) => new Date(e.end_at || e.start_at) < now;

    // base filtered by category
    let base = events.filter(inCategory);

    // timeframe filter
    if (timeframe === "Upcoming") base = base.filter(isUpcoming);
    if (timeframe === "Past") base = base.filter(isPast);

    // sort: upcoming asc by start_at, past desc by end_at
    const upcoming = base
      .filter(isUpcoming)
      .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

    const past = base
      .filter(isPast)
      .sort(
        (a, b) =>
          new Date(b.end_at || b.start_at) - new Date(a.end_at || a.start_at),
      );

    // counts for UI badges (per category)
    const countsAll = events.reduce((acc, e) => {
      const key = e.category;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return {
      filteredEvents: [...upcoming, ...past],
      counts: countsAll,
    };
  }, [activeCategory, timeframe, events, normalizeCategory]);

  // Reusable card (desktop + mobile)
  const EventCard = ({ event }) => {
    const isPast = new Date(event.end_at || event.start_at) < new Date();

    const locationElement = event.location_url ? (
      <a
        href={event.location_url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 underline decoration-accent/60 decoration-dotted hover:text-accent"
      >
        <span>{event.location_name}</span>
        <img
          src={assets.externalLinkIcon}
          alt=""
          aria-hidden="true"
          className="h-3 w-3 opacity-80"
        />
      </a>
    ) : (
      event.location_name
    );

    return (
      <article
        role="listitem"
        className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-accent/80 hover:shadow-[0_8px_24px_rgba(59,130,246,0.18)] focus-within:shadow-[0_8px_24px_rgba(59,130,246,0.2)]"
      >
        {/* Media */}
        <div className="relative">
          <ImageFrame
            src={event.cover_url}
            alt={event.title}
            aspect="4/3"
            fit="cover"
            variant="soft"
            rounded="none"
          />
          {/* Category badge */}
          <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-white/20 bg-black/30 backdrop-blur px-2.5 py-1 text-[11px] uppercase tracking-wide text-white/90">
            {event.category}
          </div>
          {/* Past badge */}
          {isPast && (
            <div className="absolute right-3 top-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur px-2.5 py-1 text-[11px] uppercase tracking-wide text-white/80">
              Past
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 flex flex-col grow text-left">
          <h3 className="text-lg md:text-xl font-semibold mb-1 leading-snug text-white">
            {event.title}
          </h3>
          <p className="text-sm text-white/70 mb-0.5">
            {formatEventDateRange(event.start_at, event.end_at)}
          </p>
          <p className="text-sm text-white/50 italic mb-3">{locationElement}</p>
          <p className="text-text2 text-white/80 leading-relaxed mb-5 grow">
            {event.summary}
          </p>

          <div className="mt-auto flex items-center justify-between">
            <Button
              variant="secondary"
              to={`/events/${event.slug}`}
              className="text-sm px-4 py-1.5"
            >
              {isPast ? "Details →" : "Details & registration →"}
            </Button>
            <svg
              className="h-5 w-5 text-white/60 group-hover:text-white transition-colors"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <path
                d="M7 5l6 5-6 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section
      id="all-events"
      className="section-container font-sans text-white pb-12 section-dark-secondary surface-pattern"
      aria-labelledby="events-section-heading"
      role="region"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 mb-6">
        <div className="text-left">
          <p className="text-xs tracking-widest text-white/60 uppercase mb-2">
            Don’t miss what’s next
          </p>
          <h2
            id="events-section-heading"
            className="heading heading-h2 leading-tight"
          >
            Upcoming &amp; Past Events
          </h2>
        </div>
      </div>

      {/* Filters Row */}
      <div className="sm:mx-0 mt-2 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3">
          {/* Category chips */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {["All", ...categoryOptions.map((opt) => opt.label)].map((cat) => {
              const active = activeCategory === cat;
              const singular = normalizeCategory(cat);
              const countLabel =
                singular === "All" ? undefined : counts[singular] || 0;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`cursor-pointer px-5 py-2 text-sm md:text-base font-medium rounded-full transition-all duration-300 border ${
                    active
                      ? "bg-accent text-white border-accent shadow-[0_0_15px_rgba(59,130,246,0.4)] scale-[1.03]"
                      : "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                  }`}
                >
                  {cat}
                  {typeof countLabel === "number" && singular !== "All" && (
                    <span className="ml-2 inline-flex items-center justify-center rounded-full bg-white/10 px-2 py-0.5 text-[11px]">
                      {countLabel}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Timeframe segmented control */}
          <div className="inline-flex rounded-full border border-white/15 bg-white/5 p-0.5">
            {["All", "Upcoming", "Past"].map((tf) => {
              const active = timeframe === tf;
              return (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={`cursor-pointer px-3.5 py-1.5 text-sm rounded-full transition-all ${
                    active
                      ? "bg-accent text-white shadow"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {tf}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      {errorMsg && (
        <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
          {errorMsg}
        </div>
      )}

      <div className="mt-4">
        {/* MOBILE: horizontal cards */}
        <div className="sm:hidden">
          {loading ? (
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="min-w-[80%] h-56 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="px-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                No events found for this filter.
              </div>
            </div>
          ) : (
            <div className="-mx-6 px-6 pb-2">
              <div
                className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar"
                role="list"
              >
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="snap-start flex-1 min-w-[80%] max-w-[85%]"
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DESKTOP / TABLET: grid */}
        <div className="hidden sm:block">
          {loading ? (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-56 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              No events found for this filter.
            </div>
          ) : (
            <div
              className="mt-2 grid gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
              role="list"
            >
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
