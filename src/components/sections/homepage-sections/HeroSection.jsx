import * as assets from "@assets";
import Button from "@components/ui/Button";
import HeroBackground from "./HeroBackground";

export default function HeroSection({
  ctaPrimary = "Become a Member",
  ctaPrimaryTo = "/join",
  ctaSecondary = "Become a Partner",
  ctaSecondaryTo = "/partners",
}) {
  return (
    <section
      id="hero"
      role="region"
      aria-labelledby="hero-heading"
      className="relative w-full min-h-screen overflow-hidden text-white font-sans"
    >
      {/* ===== Background: aurora + grid + orbit rings + node lattice ===== */}
      <HeroBackground />

      {/* Main content centered vertically */}
      <div className="section-container relative z-10 flex flex-col items-center justify-center min-h-screen text-center pt-20 sm:pt-24">
        {/* Logo */}
        <img
          src={assets.navLogo}
          alt="RoboTUM logo"
          className="w-46 sm:w-44 md:w-66 h-auto drop-shadow-lg mb-6"
          loading="eager"
          decoding="async"
        />

        {/* Heading with gradient accent on 'Robotics' */}
        <h1
          id="hero-heading"
          className="heading heading-h1 leading-tight text-balance hero-animate"
        >
          Shaping the Future of <span className="text-gradient">Robotics</span>
        </h1>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 hero-animate">
          <Button variant="primary" as="link" to={ctaPrimaryTo}>
            {ctaPrimary}
          </Button>
          {ctaSecondary && (
            <Button variant="secondary" to={ctaSecondaryTo}>
              {ctaSecondary}
            </Button>
          )}
        </div>

        {/* Tiny helper hint for scroll */}
        <div className="mt-12 flex flex-col items-center text-white/60">
          <div className="h-10 w-px bg-linear-to-b from-transparent via-white/30 to-transparent" />
          <span className="mt-2 text-[12px] tracking-[0.18em] uppercase">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
