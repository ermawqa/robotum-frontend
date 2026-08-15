import { supabase } from "@lib/supabaseClient";
import { logger } from "@utils/logger";
import {
  deletePublicImageByUrl,
  getAdminImageUploadTarget,
  uploadPublicImage,
} from "./storageApi";

// Category/status options are NOT defined here - they come from the Supabase
// project_category / project_status enums via `useEnumOptions`.
// See src/data/enumsApi.js.

/**
 * Base column list for all project queries.
 * Must match your actual DB schema.
 */
const PROJECT_FIELDS = `
  id,
  created_at,
  slug,
  name,
  category,
  summary,
  description,
  status,
  used_tools,
  future_plans,
  cover_url,
  tags,
  is_featured
`;

/**
 * Fetch featured projects (for homepage section)
 */
export async function fetchFeaturedProjects({ limit } = {}) {
  let query = supabase
    .from("projects")
    .select(PROJECT_FIELDS)
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    logger.error("Error loading featured projects:", error);
    throw error;
  }

  return data ?? [];
}

/**
 * Fetch a single project by slug (for ProjectDetail page)
 */
export async function fetchProjectBySlug(slug) {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_FIELDS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    logger.error("Error loading project by slug:", error);
    throw error;
  }

  return data; // can be null if not found
}

/**
 * Fetch projects with optional filters (for Projects list page).
 */
export async function fetchProjects(options = {}) {
  const { category, tag, search, isFeatured } = options;

  let query = supabase
    .from("projects")
    .select(PROJECT_FIELDS)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  if (typeof isFeatured === "boolean") {
    query = query.eq("is_featured", isFeatured);
  }

  if (tag) {
    query = query.contains("tags", [tag]);
  }

  if (search) {
    const pattern = `%${search}%`;
    query = query.or(`name.ilike.${pattern},summary.ilike.${pattern}`);
  }

  const { data, error } = await query;

  if (error) {
    logger.error("Error loading projects with filters:", error);
    throw error;
  }

  return data ?? [];
}

/* -------------------------------------------------------
   ADMIN HELPERS
   Used by AdminProjects page (CRUD)
------------------------------------------------------- */

/**
 * Admin: fetch all projects (no filters).
 * You can reuse this for the admin list.
 */
export async function adminFetchProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_FIELDS)
    .order("created_at", { ascending: false });

  if (error) {
    logger.error("Error fetching projects (admin):", error);
    throw error;
  }

  return data ?? [];
}

export async function adminFetchProjectsPage({ page = 1, pageSize = 10 } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 10);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const { data, error, count } = await supabase
    .from("projects")
    .select(PROJECT_FIELDS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    logger.error("Error fetching projects page (admin):", error);
    throw error;
  }

  return {
    items: data ?? [],
    total: count ?? 0,
  };
}

/**
 * Admin: insert OR update a project.
 * Expects a `project` object (from your admin form).
 */
export async function adminUpsertProject(project) {
  // Slug: either from form, or auto-generated from name
  let slug = (project.slug || "").trim();
  if (!slug && project.name) {
    slug = project.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Tags: allow either array or comma-separated string
  const tags = Array.isArray(project.tags)
    ? project.tags
    : (project.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

  let finalCoverUrl = project.cover_url?.trim() || "";
  let uploadedStoragePath = null;
  if (project.imageFile) {
    const uploadTarget = getAdminImageUploadTarget("projects");
    const { publicUrl, storagePath } = await uploadPublicImage({
      file: project.imageFile,
      folderPath: uploadTarget.folderPath,
      slug,
    });
    finalCoverUrl = publicUrl;
    uploadedStoragePath = storagePath;
  }

  const previousCoverUrl = project.previous_cover_url?.trim() || null;

  const payload = {
    slug,
    name: project.name?.trim(),
    category: project.category, // must match project_category enum
    summary: project.summary?.trim(),
    description: project.description?.trim(),
    status: project.status || null, // if you use project_status enum
    used_tools: project.used_tools?.trim() || null,
    future_plans: project.future_plans?.trim() || null,
    cover_url: finalCoverUrl,
    tags,
    is_featured: !!project.is_featured,
  };

  // Basic validation to avoid DB errors
  if (!payload.name) throw new Error("Name is required.");
  if (!payload.slug) throw new Error("Slug is required.");
  if (!payload.summary) throw new Error("Summary is required.");
  if (!payload.description) throw new Error("Description is required.");
  if (!payload.cover_url) throw new Error("Cover image is required.");
  if (!payload.category) throw new Error("Category is required.");
  if (!Array.isArray(payload.tags) || payload.tags.length === 0) {
    throw new Error("At least one tag is required.");
  }

  if (project.id) {
    // Update existing project
    const { error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", project.id);

    if (error) {
      logger.error("Error updating project:", error);
      throw error;
    }

    if (
      project.imageFile &&
      previousCoverUrl &&
      previousCoverUrl !== finalCoverUrl
    ) {
      await deletePublicImageByUrl({
        publicUrl: previousCoverUrl,
        exceptStoragePath: uploadedStoragePath,
      });
    }
  } else {
    // Insert new project
    const { error } = await supabase.from("projects").insert(payload);

    if (error) {
      logger.error("Error inserting project:", error);
      throw error;
    }
  }
}

/**
 * Admin: delete project by id
 */
export async function adminDeleteProject(id) {
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    logger.error("Error deleting project:", error);
    throw error;
  }
}
