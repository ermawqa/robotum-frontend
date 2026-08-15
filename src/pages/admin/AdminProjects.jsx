// src/pages/admin/AdminProjects.jsx
import { useCallback, useEffect, useState } from "react";
import { logger } from "@utils/logger";
import { formatProjectCategory } from "@utils/formatCategory";
import AdminLayout from "@components/admin/AdminLayout";
import Button from "@components/ui/Button";

import {
  adminFetchProjectsPage,
  adminUpsertProject,
  adminDeleteProject,
  ENUM_TYPES,
} from "@data";
import { useEnumOptions } from "@hooks/useEnumOptions";

import AdminBanner from "@components/admin/AdminBanner";
import AdminListHeader from "@components/admin/AdminListHeader";
import AdminSideCard from "@components/admin/AdminSideCard";
import AdminPagination from "@components/admin/AdminPagination";

const DEFAULT_PAGE_SIZE = 10;

const emptyForm = (defaultCategory = "") => ({
  id: null,
  name: "",
  slug: "",
  category: defaultCategory,
  summary: "",
  description: "",
  status: "",
  used_tools: "",
  future_plans: "",
  cover_url: "",
  tagsText: "", // comma-separated in the form
  is_featured: false,
});

export default function AdminProjects() {
  // Dropdown values come from the Supabase enums, not from a hardcoded list.
  const { options: categoryOptions } = useEnumOptions(
    ENUM_TYPES.PROJECT_CATEGORY,
  );
  const { options: statusOptions } = useEnumOptions(ENUM_TYPES.PROJECT_STATUS);
  const defaultCategory = categoryOptions[0]?.value ?? "";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: 0,
  });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");

  const [form, setForm] = useState(() => emptyForm(defaultCategory));

  // ---------- Load projects ----------
  const loadProjects = useCallback(async ({ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) => {
    const requestedPage = page;
    const requestedPageSize = pageSize;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      let { items, total } = await adminFetchProjectsPage({
        page: requestedPage,
        pageSize: requestedPageSize,
      });

      const totalPages = Math.max(1, Math.ceil(total / requestedPageSize));
      let nextPage = requestedPage;

      if (total > 0 && requestedPage > totalPages) {
        nextPage = totalPages;
        const fallback = await adminFetchProjectsPage({
          page: nextPage,
          pageSize: requestedPageSize,
        });
        items = fallback.items;
        total = fallback.total;
      }

      if (total === 0) {
        nextPage = 1;
      }

      setProjects(items);
      setPagination({
        currentPage: nextPage,
        pageSize: requestedPageSize,
        totalItems: total,
      });
    } catch (err) {
      logger.error("Error loading projects:", err);
      setErrorMsg(
        err.message || "Failed to load projects. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  }, [loadProjects]);

  useEffect(
    () => () => {
      if (coverPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    },
    [coverPreviewUrl],
  );

  // ---------- Helpers ----------
  const resetForm = () => {
    setForm(emptyForm(defaultCategory));
    setCoverFile(null);
    setCoverPreviewUrl((previous) => {
      if (previous?.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }
      return "";
    });
  };

  const startNew = () => {
    resetForm();
    setErrorMsg("");
    setSuccessMsg("");
  };

  const startEdit = (project) => {
    setErrorMsg("");
    setSuccessMsg("");

    setForm({
      id: project.id,
      name: project.name || "",
      slug: project.slug || "",
      category: project.category || defaultCategory,
      summary: project.summary || "",
      description: project.description || "",
      status: project.status || "",
      used_tools: project.used_tools || "",
      future_plans: project.future_plans || "",
      cover_url: project.cover_url || "",
      tagsText: (project.tags || []).join(", "),
      is_featured: !!project.is_featured,
    });

    setCoverFile(null);
    setCoverPreviewUrl((previous) => {
      if (previous?.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }
      return "";
    });
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCoverFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    setCoverFile(file);
    setCoverPreviewUrl((previous) => {
      if (previous?.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }

      if (!file) return "";
      return URL.createObjectURL(file);
    });
  };

  // ---------- Save (create/update) ----------
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        id: form.id,
        name: form.name,
        slug: form.slug,
        category: form.category,
        summary: form.summary,
        description: form.description,
        status: form.status || null,
        used_tools: form.used_tools,
        future_plans: form.future_plans,
        cover_url: form.cover_url,
        // tags will be parsed inside adminUpsertProject
        tags: form.tagsText,
        is_featured: form.is_featured,
        imageFile: coverFile,
        previous_cover_url: form.id
          ? projects.find((projectItem) => projectItem.id === form.id)
              ?.cover_url || null
          : null,
      };

      await adminUpsertProject(payload);
      await loadProjects({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
      });
      setSuccessMsg("Project saved successfully.");
      resetForm();
    } catch (err) {
      logger.error("Error saving project:", err);
      setErrorMsg(err.message || "Failed to save project.");
    } finally {
      setSaving(false);
    }
  };

  // ---------- Delete ----------
  const handleDelete = async (project) => {
    if (
      !window.confirm(
        `Delete project "${project.name}"? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await adminDeleteProject(project.id);
      await loadProjects({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
      });
      setSuccessMsg("Project deleted.");
      if (form.id === project.id) {
        resetForm();
      }
    } catch (err) {
      logger.error("Error deleting project:", err);
      setErrorMsg(err.message || "Failed to delete project.");
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("en-DE", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const isEditing = Boolean(form.id);

  return (
    <AdminLayout
      title="Projects"
      description="Manage technical, operations, and innovation projects shown on the public site."
    >
      <AdminBanner message={errorMsg} />
      <AdminBanner message={successMsg} tone="success" />

      <div className="grid gap-8 xl:grid-cols-[1.7fr_minmax(0,1.3fr)] items-start">
        {/* LEFT: List */}
        <div>
          <AdminListHeader
            title="Existing projects"
            buttonLabel="+ New project"
            onButtonClick={startNew}
          />

          {loading ? (
            <p className="text-sm text-white/60">Loading…</p>
          ) : projects.length === 0 ? (
            <p className="text-sm text-white/60">
              No projects yet. Create the first one using the form on the right.
            </p>
          ) : (
            <ul className="space-y-3">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="flex items-start justify-between gap-3 card-surface card-surface-hover px-4 py-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-white truncate">
                        {p.name}
                      </p>
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/10 border border-white/15 px-2 py-0.5 text-[11px] text-white/70 capitalize">
                        {formatProjectCategory(p.category)}
                        {p.is_featured && (
                          <span className="ml-1 text-[10px] text-amber-300">
                            • featured
                          </span>
                        )}
                      </span>
                      {p.status && (
                        <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-white/60 uppercase tracking-wide">
                          {p.status}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-white/60 line-clamp-2">
                      {p.summary}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-[11px] text-white/40">
                        {formatDate(p.created_at)}
                      </span>
                    </div>

                    {Array.isArray(p.tags) && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {p.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-white/60"
                          >
                            {tag}
                          </span>
                        ))}
                        {p.tags.length > 4 && (
                          <span className="text-[10px] text-white/50">
                            +{p.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => startEdit(p)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="danger"
                      onClick={() => handleDelete(p)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!loading && (
            <AdminPagination
              currentPage={pagination.currentPage}
              pageSize={pagination.pageSize}
              totalItems={pagination.totalItems}
              onPageChange={(nextPage) =>
                loadProjects({ page: nextPage, pageSize: pagination.pageSize })
              }
              onPageSizeChange={(nextPageSize) =>
                loadProjects({ page: 1, pageSize: nextPageSize })
              }
            />
          )}
        </div>

        {/* RIGHT: Form */}
        <AdminSideCard
          title={isEditing ? "Edit project" : "New project"}
          description={
            isEditing
              ? "Update project details, tags, and homepage visibility."
              : "Create a new project entry for the public site."
          }
        >
          <form className="space-y-4" onSubmit={handleSave}>
            {/* Name & slug */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="proj-name">
                Name
              </label>
              <input
                id="proj-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="field-input"
                placeholder="Autonomous humanoid navigation stack"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="proj-slug">
                Slug (optional, generated from name if empty)
              </label>
              <input
                id="proj-slug"
                name="slug"
                type="text"
                value={form.slug}
                onChange={handleChange}
                className="field-input"
                placeholder="humanoid-navigation"
              />
            </div>

            {/* Category & status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label
                  className="text-xs text-white/70"
                  htmlFor="proj-category"
                >
                  Category
                </label>
                <select
                  id="proj-category"
                  name="category"
                  required
                  value={form.category}
                  onChange={handleChange}
                  className="field-input"
                >
                  {categoryOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70" htmlFor="proj-status">
                  Status (optional)
                </label>
                <select
                  id="proj-status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="field-input"
                >
                  <option value="">- None -</option>
                  {statusOptions.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="proj-summary">
                Summary (shown in cards)
              </label>
              <textarea
                id="proj-summary"
                name="summary"
                rows={3}
                required
                value={form.summary}
                onChange={handleChange}
                className="field-input resize-y"
                placeholder="Short description used on overview cards…"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label
                className="text-xs text-white/70"
                htmlFor="proj-description"
              >
                Full description
              </label>
              <textarea
                id="proj-description"
                name="description"
                rows={4}
                required
                value={form.description}
                onChange={handleChange}
                className="field-input resize-y"
                placeholder="More detailed description for the project detail page…"
              />
            </div>

            {/* Used tools & future plans */}
            <div className="space-y-1">
              <label
                className="text-xs text-white/70"
                htmlFor="proj-used-tools"
              >
                Used tools / tech stack (optional)
              </label>
              <textarea
                id="proj-used-tools"
                name="used_tools"
                rows={2}
                value={form.used_tools}
                onChange={handleChange}
                className="field-input resize-y"
                placeholder="ROS2, NVIDIA Jetson, custom motor drivers…"
              />
            </div>

            <div className="space-y-1">
              <label
                className="text-xs text-white/70"
                htmlFor="proj-future-plans"
              >
                Future plans (optional)
              </label>
              <textarea
                id="proj-future-plans"
                name="future_plans"
                rows={2}
                value={form.future_plans}
                onChange={handleChange}
                className="field-input resize-y"
                placeholder="Next steps, competitions, long-term roadmap…"
              />
            </div>

            {/* Cover image upload */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="proj-cover-file">
                Cover image
              </label>
              <input
                id="proj-cover-file"
                name="cover_file"
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="field-input"
              />
              <p className="text-[11px] text-white/40">
                Upload a new image or keep the existing one. Max file size: 10MB.
              </p>

              <div className="space-y-1 pt-1">
                <label
                  className="text-[11px] text-white/55"
                  htmlFor="proj-cover-url"
                >
                  Optional external URL fallback
                </label>
                <input
                  id="proj-cover-url"
                  name="cover_url"
                  type="url"
                  value={form.cover_url}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                  placeholder="https://…"
                />
              </div>

              {(coverPreviewUrl || form.cover_url) && (
                <div className="mt-2 rounded-lg border border-white/10 bg-black/40 p-2">
                  <p className="text-[11px] text-white/50 mb-1">
                    Preview:
                  </p>
                  <div className="aspect-video w-full overflow-hidden rounded-md bg-black/60">
                    <img
                      src={coverPreviewUrl || form.cover_url}
                      alt="Cover preview"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="proj-tags">
                Tags (comma-separated)
              </label>
              <input
                id="proj-tags"
                name="tagsText"
                type="text"
                required
                value={form.tagsText}
                onChange={handleChange}
                className="field-input"
                placeholder="robotics, ai, humanoid robots"
              />
              <p className="text-[11px] text-white/40">
                These are stored as a <code>text[]</code> in the database.
              </p>
            </div>

            {/* Featured */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs text-white/80">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={form.is_featured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-white/30 bg-black/40 text-accent focus-visible:ring-accent"
                />
                <span>Show as featured on homepage</span>
              </label>

              {form.id && (
                <span className="text-[11px] text-white/40">
                  Project ID:{" "}
                  <span className="font-mono text-[10px]">
                    {form.id.slice(0, 8)}…
                  </span>
                </span>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-3">
              {isEditing && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={startNew}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                size="sm"
                variant="primary"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save project"}
              </Button>
            </div>
          </form>
        </AdminSideCard>
      </div>
    </AdminLayout>
  );
}
