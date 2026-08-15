import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { fetchProjectBySlug } from "@data";
import ImageFrame from "@components/ui/ImageFrame";
import Button from "@components/ui/Button";
import LinkifiedText from "@components/ui/LinkifiedText";
import Navbar from "@components/sections/common-sections/Navbar";
import FooterSection from "@components/sections/common-sections/FooterSection";
import PageLoader from "@components/sections/common-sections/PageLoader";
import { useAsyncData } from "@hooks/useAsyncData";
import { formatProjectCategory } from "@utils/formatCategory";

export default function ProjectDetail() {
  const { slug } = useParams();
  const {
    data: project,
    loading,
    error: errorMsg,
  } = useAsyncData(() => fetchProjectBySlug(slug), [slug], {
    errorMessage: "Failed to load project. Please try again later.",
  });

  // Update document title when project is loaded
  useEffect(() => {
    document.title = project
      ? `${project.name} | RoboTUM`
      : "Project | RoboTUM";
  }, [project]);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <PageLoader />
        <FooterSection />
      </>
    );
  }

  if (!project || errorMsg === "Project not found.") {
    return (
      <>
        <Navbar />
        <section className="min-h-screen px-6 md:px-12 py-20 text-white flex flex-col justify-center section-dark-primary surface-pattern">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading heading-h2 mb-6">Project not found</h1>
            {errorMsg && (
              <p className="text-sm text-red-400 mb-4">{errorMsg}</p>
            )}
            <Button
              as={Link}
              to="/projects"
              variant="secondary"
              className="mt-4"
            >
              Back to Projects
            </Button>
          </div>
        </section>
        <FooterSection />
      </>
    );
  }

  const formattedCategory = formatProjectCategory(project.category);

  return (
    <>
      <Navbar />
      <section className="section-container min-h-screen text-white font-sans section-dark-primary surface-pattern py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12 md:grid-cols-2 items-start">
            <div>
              <ImageFrame
                src={project.cover_url}
                alt={project.name}
                aspect="16/9"
                fit="cover"
                variant="border"
                vignette
                className="w-full rounded-lg"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="heading heading-h1 mb-4">{project.name}</h1>
              <span className="inline-block px-4 py-1 rounded-full text-xs md:text-sm bg-white/10 border border-white/10 mb-6 capitalize">
                {formattedCategory}
              </span>
              <LinkifiedText
                as="p"
                text={project.description || project.summary}
                className="text-text1 text-white/80 mb-8 leading-relaxed text-base md:text-lg whitespace-pre-line"
              />
              <div className="flex flex-wrap gap-3 mb-8">
                {project.tags?.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-xs md:text-sm bg-white/10 border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mt-auto">
                <Button
                  as={Link}
                  to="/projects"
                  variant="secondary"
                  className="whitespace-nowrap"
                >
                  ← Back to Projects
                </Button>
                {project.links?.map?.((l) => (
                  <Button
                    key={l.href}
                    as="a"
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    variant="primary"
                    className="whitespace-nowrap"
                  >
                    {l.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterSection />
    </>
  );
}
