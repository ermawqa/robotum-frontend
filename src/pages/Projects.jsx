import { useMemo, useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fetchProjects } from "@data"; // Supabase
import { useAsyncData } from "@hooks/useAsyncData";
import ProjectCard from "@components/ui/ProjectCard";
import Button from "@components/ui/Button";
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import PageLoader from "@components/sections/common-sections/PageLoader";

// Top tabs (now local, no dependency on projects.js)
// Keys MUST match Supabase `projects.category` values.
const TABS = [
  { key: "technical", label: "Technical" },
  { key: "operations", label: "Operations" },
  {
    key: "innovation-and-entrepreneurship",
    label: "Innovation & Entrepreneurship",
  },
];

// Fixed curated tag list (10 tags only)
const CURATED_TAGS = [
  "robotics",
  "ai",
  "autonomy",
  "ros2",
  "hardware",
  "software",
  "humanoid robots",
  "drones",
  "web development",
  "community",
];

export default function Projects() {
  const [params, setParams] = useSearchParams();

  const {
    data: projects,
    loading,
    error: errorMsg,
  } = useAsyncData(fetchProjects, [], {
    initialData: [],
    errorMessage: "Failed to load projects. Please try again later.",
  });

  // top tabs (technical, operations, innovation)
  const initial =
    TABS.find((t) => t.key === params.get("type"))?.key || "technical";
  const [active, setActive] = useState(initial);

  // search + tag filters
  const [query, setQuery] = useState(params.get("q") || "");
  const [tag, setTag] = useState(params.get("tag") || "");

  // scroll to top
  useEffect(() => {
    document.title = "Projects | RoboTUM";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  // sync URL
  useEffect(() => {
    const next = new URLSearchParams();
    next.set("type", active);
    if (query) next.set("q", query);
    if (tag) next.set("tag", tag);
    setParams(next, { replace: true });
  }, [active, query, tag, setParams]);

  // Filtering logic
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      // 1) filter by category tab
      if (p.category !== active) return false;

      // 2) search text
      const content = (
        p.title +
        (p.summary || "") +
        (p.tags || []).join(" ")
      ).toLowerCase();
      const okQ = query ? content.includes(query.toLowerCase()) : true;

      // 3) curated tag filter
      const okTag = tag ? (p.tags || []).includes(tag) : true;

      return okQ && okTag;
    });
  }, [active, query, tag, projects]);

  // curated tags show always
  const availableTags = CURATED_TAGS;

  // loader
  if (loading) {
    return (
      <>
        <Navbar />
        <PageLoader />
        <FooterSection />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <section className="section-container hero-offset min-h-screen text-white font-sans section-dark-primary surface-pattern">
        <div>
          <header className="mb-8">
            <h1 className="heading heading-h1">Projects</h1>
            <p className="text-text1 text-white/80 mt-3">
              Explore our initiatives across engineering, operations, and
              entrepreneurship.
            </p>
            {errorMsg && (
              <p className="text-sm text-red-400 mt-3">{errorMsg}</p>
            )}
          </header>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TABS.map((t) => {
              const activeTab = t.key === active;
              return (
                <button
                  key={t.key}
                  onClick={() => setActive(t.key)}
                  className={`cursor-pointer px-4 py-2 rounded-full text-sm transition-colors duration-300 
                  ${
                    activeTab
                      ? "bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,.35)]"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            {/* Search */}
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects"
              className="w-full sm:w-72 px-3 py-2 rounded-md bg-white/10 border border-white/10 text-white placeholder-white/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors"
              aria-label="Search projects"
            />

            {/* Tag chips */}
            <div className="flex gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setTag("")}
                className={`px-3 py-1.5 rounded-full text-xs transition-colors 
                ${
                  !tag
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                All
              </button>

              {availableTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`cursor-pointer px-3 py-1.5 rounded-full text-xs transition-colors 
                  ${
                    tag === t
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}

            {filtered.length === 0 && (
              <p className="text-center text-sm text-white/60 col-span-full">
                No matching projects yet.
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Button as={Link} to="/join" variant="primary">
              Join a project
            </Button>
          </div>
        </div>
      </section>
      <FooterSection />
    </>
  );
}
