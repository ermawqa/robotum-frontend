import Button from "@components/ui/Button";
import SectionLoader from "@components/sections/common-sections/SectionLoader";
import { fetchActivePartners } from "@data"; // centralized data logic
import { useAsyncData } from "@hooks/useAsyncData";
import { formatPartnerCategory } from "@utils/formatCategory";

/** Target items on screen before the loop repeats - keeps short partner lists
 *  from leaving a visible empty stretch mid-scroll. */
const MIN_LANE_ITEMS = 10;
/** Seconds each logo spends crossing the lane (constant perceived speed). */
const SECONDS_PER_ITEM = 3.2;
const MIN_DURATION = 20;

/**
 * PartnersSection
 * - All viewports: one endless animated marquee lane.
 * - Logos are raw <img> with no backgrounds, tiles, or borders.
 */
export default function PartnersSection() {
  const {
    data: partners,
    loading,
    error: errorMsg,
  } = useAsyncData(fetchActivePartners, [], {
    initialData: [],
    errorMessage: "Failed to load partners. Please try again later.",
  });

  const allPartners = partners.map((p) => ({
    ...p,
    groupTitle: formatPartnerCategory(p.category),
  }));

  // Pad short lists so one copy always overflows the lane, then render that
  // copy twice: the track is exactly 2x wide, so translateX(-50%) is seamless.
  const repeats = allPartners.length
    ? Math.max(1, Math.ceil(MIN_LANE_ITEMS / allPartners.length))
    : 0;
  const laneItems = Array.from({ length: repeats }, () => allPartners).flat();
  const duration = Math.max(MIN_DURATION, laneItems.length * SECONDS_PER_ITEM);

  return (
    <section
      className="section-container font-sans section-light surface-pattern"
      role="region"
      aria-labelledby="partners-heading"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div className="text-left">
          <p className="text-xs tracking-widest text-white/60 uppercase mb-2">
            Thank you to our community of supporters
          </p>
          <h2
            id="partners-heading"
            className="heading heading-h2 font-bold leading-tight"
          >
            Our <span className="text-gradient">Sponsors &amp; Partners</span>
          </h2>
        </div>
        <Button to="/partners" variant="secondary">
          Meet Our Partners →
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <SectionLoader />
      ) : errorMsg ? (
        <p className="text-center text-sm text-red-400">{errorMsg}</p>
      ) : allPartners.length === 0 ? (
        <p className="text-center text-sm text-white/60">
          Partners will appear here soon.
        </p>
      ) : (
        <div className="relative w-full overflow-hidden rounded-2xl bg-white ring-1 ring-accent/15">
          {/* Left/Right decorative fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28 bg-linear-to-r from-white via-white/80 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28 bg-linear-to-l from-white via-white/80 to-transparent z-20" />

          {/* Marquee: two identical copies form one seamless track */}
          <div
            className="flex w-max py-5 animate-marquee motion-reduce:animate-none"
            style={{ "--marquee-duration": `${duration}s` }}
          >
            {[0, 1].map((copy) => (
              <ul
                key={`lane-${copy}`}
                className="flex shrink-0 items-center"
                aria-hidden={copy === 1 || undefined}
              >
                {laneItems.map((partner, idx) => {
                  const Wrapper = partner.website_url ? "a" : "div";
                  return (
                    <li
                      key={`partner-${partner.id}-${idx}`}
                      className="flex-none pr-10 sm:pr-12"
                    >
                      <Wrapper
                        href={partner.website_url || undefined}
                        target={partner.website_url ? "_blank" : undefined}
                        rel={
                          partner.website_url
                            ? "noopener noreferrer"
                            : undefined
                        }
                        aria-label={partner.name}
                        tabIndex={copy === 1 ? -1 : undefined}
                        className="marquee-item block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          draggable="false"
                          loading="lazy"
                          className="h-8 sm:h-10 md:h-12 w-auto object-contain"
                        />
                      </Wrapper>
                    </li>
                  );
                })}
              </ul>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
