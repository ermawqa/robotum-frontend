import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import * as assets from "@assets";
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import PageLoader from "@components/sections/common-sections/PageLoader";
import ImageFrame from "@components/ui/ImageFrame";
import Button from "@components/ui/Button";
import { fetchEventBySlug } from "@data"; // from eventsApi.js
import { formatEventDateRange } from "@utils/date-range";
import { useAsyncData } from "@hooks/useAsyncData";
import { formatEventCategory } from "@utils/formatCategory";

export default function EventDetail() {
  const { slug } = useParams();
  const {
    data: event,
    loading,
    error: errorMsg,
  } = useAsyncData(() => fetchEventBySlug(slug), [slug], {
    errorMessage: "Failed to load event details.",
  });

  useEffect(() => {
    if (event) {
      document.title = `${event.title} | RoboTUM Events`;
    } else {
      document.title = "Event | RoboTUM";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [event]);

  if (loading) {
    return (
      <>
        <Navbar />
        <PageLoader />
        <FooterSection />
      </>
    );
  }

  if (!event || errorMsg) {
    return (
      <>
        <Navbar />
        <section className="min-h-screen px-6 md:px-12 py-20 text-white flex flex-col justify-center section-dark-primary surface-pattern">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="heading heading-h2 mb-4">
              {errorMsg || "Event not found"}
            </h1>
            <p className="text-text2 text-white/70 mb-6">
              The event you’re looking for might have been moved or no longer
              exists.
            </p>
            <Button as={Link} to="/events" variant="secondary" className="mt-2">
              Back to Events
            </Button>
          </div>
        </section>
        <FooterSection />
      </>
    );
  }

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
    <>
      <Navbar />
      <section className="section-container min-h-screen text-white font-sans section-dark-primary surface-pattern py-16 md:py-20">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Top meta */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 uppercase tracking-wide text-white/80">
                {formatEventCategory(event.category, { fallback: "" })}
              </span>
              <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 uppercase tracking-wide text-white/70">
                {event.format}
              </span>
              {event.is_featured && (
                <span className="inline-flex items-center rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 uppercase tracking-wide text-yellow-200">
                  Featured
                </span>
              )}
              {isPast && (
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 uppercase tracking-wide text-white/60">
                  Past event
                </span>
              )}
            </div>

            <h1 className="heading heading-h1 leading-tight">{event.title}</h1>

            <p className="text-text2 text-white/70 text-sm md:text-base">
              {formatEventDateRange(event.start_at, event.end_at)} ·{" "}
              {locationElement}
            </p>
          </div>

          {/* Cover image */}
          <div>
            <ImageFrame
              src={event.cover_url}
              alt={event.title}
              aspect="16/9"
              fit="cover"
              variant="border"
              vignette
              className="w-full rounded-2xl"
            />
          </div>

          {/* Content + actions */}
          <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)] items-start">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white">
                About the event
              </h2>
              <p className="text-text2 text-white/80 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white/90">
                Event details
              </h3>

              <dl className="space-y-3 text-sm text-white/80">
                <div className="flex gap-2">
                  <dt className="w-24 text-white/60">When</dt>
                  <dd>{formatEventDateRange(event.start_at, event.end_at)}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 text-white/60">Location</dt>
                  <dd>{locationElement}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-24 text-white/60">Format</dt>
                  <dd>{event.format}</dd>
                </div>
              </dl>

              <div className="pt-2 flex flex-col gap-2">
                {!isPast && event.registration_url && (
                  <Button
                    as="a"
                    href={event.registration_url}
                    target="_blank"
                    rel="noreferrer"
                    variant="primary"
                    className="w-full justify-center"
                  >
                    Register →
                  </Button>
                )}
                <Button
                  as={Link}
                  to="/events"
                  variant="secondary"
                  className="w-full justify-center"
                >
                  ← Back to Events
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>
      <FooterSection />
    </>
  );
}
