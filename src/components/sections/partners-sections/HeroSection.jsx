import Button from "@components/ui/Button";
import * as assets from "@assets";

/**
 * Partners page Hero
 * - Uses dark surface for contrast and depth
 * - Balanced layout that scales from mobile → desktop
 * - Reuses global heading tokens and button components
 * - Includes breadcrumb, title, copy, CTAs, and quick category chips
 */
const HeroSection = () => {
  return (
    <section
      id="partners-hero"
      className="section-container text-white min-h-screen flex items-center relative overflow-hidden section-dark-primary surface-pattern"
      aria-labelledby="partners-hero-heading"
      role="region"
    >
      {/* Optional blurred robotics lab image */}
      <img
        src={assets.heroBackground}
        alt="Partnership"
        className="hidden md:block section-media opacity-20 blur-sm"
      />

      <div className="relative z-10">
        {/* Headline + Subcopy */}
        <header className="max-w-3xl">
          <h1
            id="partners-hero-heading"
            className="heading heading-h1 text-gradient hero-animate"
          >
            Partnerships & Collaborations
          </h1>
          <p className="mt-4 md:mt-5 text-text1 text-white/80 hero-animate">
            Partnerships that turn vision into reality.
          </p>
        </header>

        {/* CTAs */}
        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 hero-animate">
          <Button
            scrollTarget="contact"
            variant="primary"
            className="w-full sm:w-auto"
          >
            Become a partner
          </Button>
          <Button
            scrollTarget="partner-categories"
            variant="secondary"
            className="w-full sm:w-auto"
          >
            View all partners ↓
          </Button>
        </div>

        {/* Quick categories / chips */}
        <ul className="mt-8 md:mt-10 flex flex-wrap items-center gap-2.5 hero-animate">
          {[
            "Lead Sponsors",
            "Sponsors",
            "Industry Collaborators",
            "Academic Collaborators",
          ].map((label) => (
            <li key={label}>
              <span
                className="inline-flex items-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3 py-1.5 text-[13px] text-white/90
                           shadow-sm hover:shadow-md hover:bg-white/20 transition-all duration-200"
              >
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HeroSection;
