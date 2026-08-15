import { supabase } from "@lib/supabaseClient";
import { logger } from "@utils/logger";
import { ENUM_TYPES, fetchEnumOptions } from "./enumsApi";

// The team grid shows a curated subset of the public.membership_type enum -
// see ENUM_ALLOWLIST in enumsApi.js to change which values appear.

/**
 * Turn a membership_type label into a per-person role label:
 * "Project Leads" -> "Project Lead". Values that are not plural are left
 * alone, so new enum values get a sensible label without a code change.
 */
function toRoleLabel(membershipType) {
  if (!membershipType) return "Member";
  return String(membershipType).replace(/s$/, "");
}

/**
 * Fetch team members for About page
 * - Uses members_personal + member_memberships
 * - Adds projects for Project Leads from projects.project_lead_id
 */
export async function fetchTeamMembers() {
  // 0) Live membership types from the DB enum (falls back to enumsApi defaults)
  const categoryOptions = await fetchEnumOptions(ENUM_TYPES.MEMBERSHIP_TYPE);
  const categories = categoryOptions.map((option) => option.value);

  // 1) Get memberships + linked member info
  const { data: rows, error } = await supabase
    .from("member_memberships")
    .select(
      `
      membership_type,
      member:members_personal (
        id,
        full_name,
        avatar_url,
        linkedin_url
      )
    `,
    )
    .in("membership_type", categories); // only the categories we display

  if (error) {
    logger.error("Error fetching member memberships:", error);
    throw error;
  }

  if (!rows || rows.length === 0) {
    return [];
  }

  // 2) Flatten rows into simple member objects (one per membership_type)
  const flatMembers = rows
    .filter((row) => row.member) // safety
    .map((row) => {
      const m = row.member;
      const membershipType = row.membership_type;

      const roleLabel = toRoleLabel(membershipType);

      return {
        id: m.id,
        name: m.full_name,
        photo: m.avatar_url,
        linkedin: m.linkedin_url,
        category: membershipType, // a public.membership_type enum label
        role: roleLabel,
        projects: [], // filled below for project leads
      };
    });

  // 3) For project leads, fetch projects where they are project_lead_id
  const projectLeadIds = Array.from(
    new Set(
      flatMembers
        .filter((m) => m.category === "Project Leads")
        .map((m) => m.id),
    ),
  );

  let projectsByLead = {};
  if (projectLeadIds.length > 0) {
    const { data: projects, error: projError } = await supabase
      .from("projects")
      .select("id, name, project_lead_id")
      .in("project_lead_id", projectLeadIds);

    if (projError) {
      logger.error("Error fetching projects for project leads:", projError);
      throw projError;
    }

    projectsByLead = (projects || []).reduce((acc, p) => {
      if (!acc[p.project_lead_id]) acc[p.project_lead_id] = [];
      acc[p.project_lead_id].push({
        id: p.id,
        name: p.name, // 🔴 FIXED: was `title`
      });
      return acc;
    }, {});
  }

  // 4) Attach projects to project-lead members
  return flatMembers.map((m) => ({
    ...m,
    projects: projectsByLead[m.id] || [],
  }));
}

export async function fetchMemberStories() {
  const { data, error } = await supabase
    .from("members_personal")
    .select(
      `
      id,
      full_name,
      avatar_url,
      story,
      created_at,
      study_program,
      university,
      member_projects:member_projects (
        role,
        department_slug,
        department:departments (
          name
        )
      )
    `,
    )
    // only rows where story is NOT NULL
    .not("story", "is", null);

  if (error) {
    logger.error("Error fetching member stories:", error);
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((row) => {
    const mp = Array.isArray(row.member_projects)
      ? row.member_projects[0]
      : null;

    const departmentName = mp?.department?.name || mp?.department_slug;

    const joinedYear = row.created_at
      ? new Date(row.created_at).getFullYear()
      : null;

    return {
      id: row.id,
      name: row.full_name,
      avatarUrl: row.avatar_url,
      story: row.story,
      joinedYear,
      studyProgram: row.study_program,
      university: row.university,
      role: mp?.role || "Member",
      department: departmentName,
    };
  });
}
