import { useEffect, useRef, useState } from "react";
import Button from "@components/ui/Button";
import ImageFrame from "@components/ui/ImageFrame";
import SectionLoader from "@components/sections/common-sections/SectionLoader";
import { fetchFeaturedProjects } from "@data";
import { useAsyncData } from "@hooks/useAsyncData";

// Featured projects, with "Humanoid" pinned first.
async function loadFeaturedOrdered() {
  const data = await fetchFeaturedProjects();
  const featuredOnly = (data ?? []).filter((p) => p.is_featured === true);
  const isHumanoid = (p) => p.slug === "humanoid" || p.name === "Humanoid";
  return [
    ...featuredOnly.filter(isHumanoid),
    ...featuredOnly.filter((p) => !isHumanoid(p)),
  ];
}

export default function ProjectSection() {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef(null);
  const {
    data: projects,
    loading,
    error: errorMsg,
  } = useAsyncData(loadFeaturedOrdered, [], {
    initialData: [],
    errorMessage: "Failed to load featured projects. Please try again later.",
  });

  const scrollToIndex = (idx) => {
    const track = trackRef.current;
    if (!track) return;
    const slides = track.querySelectorAll(".rt-slide");
    const target = slides[idx];
    if (target)
      target.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
  };

  const nextProject = () => {
    if (current < projects.length - 1) setCurrent((prev) => prev + 1);
  };

  const prevProject = () => {
    if (current > 0) setCurrent((prev) => prev - 1);
  };

  useEffect(() => {
    if (projects.length > 0 && current > 0) {
      scrollToIndex(current);
    }
  }, [current, projects.length]);

  return (
    <section
      id="projects"
      className="section-container text-white font-sans section-dark-secondary surface-pattern"
    >
      {/* Section header */}
      <div className="mb-10 md:mb-14">
        <p className="text-xs tracking-widest text-white/60 uppercase mb-2">
          Featured projects
        </p>
        <h2 className="heading heading-h1 font-bold leading-tight text-left">
          <span className="text-gradient">Engineering </span> the Future
        </h2>
      </div>

      {loading ? (
        <div className="mt-10">
          <SectionLoader />
        </div>
      ) : errorMsg ? (
        <p className="mt-8 text-center text-sm text-red-400">{errorMsg}</p>
      ) : projects.length === 0 ? (
        <p className="mt-8 text-center text-sm text-white/70">
          Featured projects will appear here soon.
        </p>
      ) : (
        <>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10 md:gap-16">
            {/* LEFT - Text Info */}
            <div className="hidden md:block w-full md:w-1/2 relative text-center md:text-left min-h-[300px]">
              <div
                key={current}
                className="transition-all duration-700 ease-in-out animate-fadeIn"
              >
                <h2 className="heading heading-h2 font-bold mb-4 leading-tight text-balance">
                  {projects[current].name}
                </h2>
                <p className="text-text1 text-white/80 mb-6 leading-relaxed">
                  {projects[current].summary}
                </p>
                <div className="mt-4 md:mt-6 flex flex-col items-start gap-3">
                  <Button
                    variant="secondary"
                    as="link"
                    to={`/projects/${projects[current].slug}`}
                  >
                    View more →
                  </Button>
                </div>
              </div>
            </div>

            {/* RIGHT - Image carousel (desktop) */}
            <div className="hidden md:flex md:w-1/2 relative flex-col items-center self-start">
              <div className="relative w-full max-w-md mx-auto -mt-6 md:-mt-10 aspect-3/2 min-h-[220px] sm:min-h-[260px]">
                {projects.map((p, i) => (
                  <div
                    key={p.id ?? p.slug ?? p.name}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      i === current ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <ImageFrame
                      src={p.cover_url}
                      alt={p.name}
                      aspect="3/2"
                      fit="cover"
                      variant="soft"
                      rounded="2xl"
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              {/* Controls below image (desktop) */}
              <div className="mt-10 flex items-center justify-center gap-4 z-10 relative">
                <Button
                  variant="secondary"
                  as="button"
                  onClick={prevProject}
                  disabled={current === 0}
                  aria-label="Previous project"
                  className="px-4 py-2 text-sm"
                >
                  ← Previous
                </Button>
                <Button
                  variant="secondary"
                  as="button"
                  onClick={nextProject}
                  disabled={current === projects.length - 1}
                  aria-label="Next project"
                  className="px-4 py-2 text-sm"
                >
                  Next →
                </Button>
              </div>
            </div>

            {/* MOBILE - Horizontal scrollable cards */}
            <div className="md:hidden w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div ref={trackRef} className="flex gap-6 min-w-full">
                {projects.map((p) => (
                  <div
                    key={p.id ?? p.slug ?? p.name}
                    className="rt-slide snap-center shrink-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-5 w-80 sm:w-96 text-center flex flex-col items-center justify-between"
                  >
                    <ImageFrame
                      src={p.cover_url}
                      alt={p.name}
                      aspect="3/2"
                      fit="cover"
                      variant="soft"
                      rounded="xl"
                      className="w-full mb-4"
                    />
                    <h3 className="text-text1 font-semibold mb-2">{p.name}</h3>
                    <p className="text-text2 text-white/80 text-sm leading-relaxed mb-4 line-clamp-4">
                      {p.summary}
                    </p>
                    <Button
                      variant="secondary"
                      as="link"
                      to={`/projects/${p.slug}`}
                      className="text-sm px-4 py-2"
                    >
                      View more →
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* DOTS (only for desktop) */}
          <div
            className="hidden md:flex mt-10 justify-center gap-2"
            role="tablist"
            aria-label="Project slides"
          >
            {projects.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === current}
                onClick={() => setCurrent(i)}
                className={`cursor-pointer w-3.5 h-3.5 rounded-full transition-colors ${
                  i === current ? "bg-white" : "bg-white/30 hover:bg-white/50"
                }`}
              >
                <span className="sr-only">Go to slide {i + 1}</span>
              </button>
            ))}
          </div>
          <div className="mt-10 md:flex justify-center">
            <Button variant="primary" as="link" to="/projects">
              View All Projects →
            </Button>
          </div>
        </>
      )}
    </section>
  );
}
