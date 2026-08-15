// src/components/sections/about/TeamSection.jsx
import { useEffect, useMemo, useState } from "react";
import * as assets from "@assets";
import ImageFrame from "@components/ui/ImageFrame";
import Button from "@components/ui/Button";
import { ENUM_TYPES, fetchTeamMembers } from "@data";
import { useAsyncData } from "@hooks/useAsyncData";
import { useEnumOptions } from "@hooks/useEnumOptions";

export default function TeamSection() {
  // Categories come from the Supabase membership_type enum.
  const { options: categoryOptions } = useEnumOptions(
    ENUM_TYPES.MEMBERSHIP_TYPE,
  );

  // default to first category
  const [selectedCategory, setSelectedCategory] = useState(
    () => categoryOptions[0]?.value ?? "",
  );

  // If the enum changed in the DB, the selected tab may no longer exist.
  useEffect(() => {
    const exists = categoryOptions.some((o) => o.value === selectedCategory);
    if (!exists) setSelectedCategory(categoryOptions[0]?.value ?? "");
  }, [categoryOptions, selectedCategory]);

  const {
    data: teamMembers,
    loading,
    error: errorMsg,
  } = useAsyncData(fetchTeamMembers, [], {
    initialData: [],
    errorMessage: "Failed to load team. Please try again later.",
  });

  // Filter by selected category
  const filteredTeam = useMemo(
    () => teamMembers.filter((member) => member.category === selectedCategory),
    [teamMembers, selectedCategory],
  );

  return (
    <section
      id="team-section"
      className="section-container text-white font-sans section-dark-primary surface-pattern"
      aria-labelledby="team-heading"
    >
      <div>
        <h2
          id="team-heading"
          className="heading heading-h1 leading-tight text-balance mb-10 text-center"
        >
          Meet Our Team
        </h2>

        {/* Category Buttons – no "All" */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
          {categoryOptions.map(({ value: category, label }) => {
            const active = selectedCategory === category;
            return (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={active ? "primary" : "secondary"}
                className={`rounded-full text-sm md:text-base font-medium px-5 py-2 transition-all duration-300 ${
                  active
                    ? "bg-accent text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-[1.05]"
                    : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white hover:scale-[1.03]"
                }`}
              >
                {label}
              </Button>
            );
          })}
        </div>

        {/* Error / Loading */}
        {errorMsg && (
          <p className="mb-6 text-center text-sm text-red-200">{errorMsg}</p>
        )}
        {loading && !errorMsg && (
          <p className="mb-6 text-center text-sm text-white/60">
            Loading team…
          </p>
        )}

        {/* Team Grid */}
        {!loading && !errorMsg && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-10">
            {filteredTeam.map((member) => (
              <article
                key={`${member.id}-${member.category}`}
                className="group bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer text-center"
              >
                {/* Avatar from avatar_url, with branded initials fallback */}
                <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-white/10 border border-white/5">
                  {member.photo ? (
                    <ImageFrame
                      src={member.photo}
                      alt={member.name}
                      variant="soft"
                      rounded="xl"
                      fit="cover"
                      className="group-hover:scale-[1.05] transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-accent/30 to-[#7C3AED]/30 text-2xl font-semibold text-white/90">
                      {member.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  )}
                </div>

                {/* Text */}
                <div className="mt-4 space-y-1">
                  <h3 className="text-text1 font-semibold">{member.name}</h3>
                  {/* <p className="text-text2 text-white/70 text-sm">
                    {member.role}
                  </p> */}

                  {/* Extra label for Project Leads: show project name(s) */}
                  {member.category === "Project Leads" &&
                    member.projects &&
                    member.projects.length > 0 && (
                      <p className="text-[11px] text-accent mt-1">
                        {member.projects.map((p) => p.name).join(", ")}
                      </p>
                    )}
                </div>

                {/* LinkedIn from linkedin_url */}
                {member.linkedin && (
                  <div className="mt-3 flex justify-center">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${member.name} LinkedIn`}
                      className="inline-flex items-center gap-2 text-white/80 hover:text-accent transition-colors"
                    >
                      <img
                        src={assets.linkedinIcon}
                        alt=""
                        className="w-5 h-5"
                      />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
