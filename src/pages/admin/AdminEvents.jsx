import { useCallback, useEffect, useState } from "react";
import { logger } from "@utils/logger";
import AdminLayout from "@components/admin/AdminLayout";
import Button from "@components/ui/Button";

import {
  adminFetchEventsPage,
  adminUpsertEvent,
  adminDeleteEvent,
  EVENT_CATEGORY_OPTIONS,
  EVENT_FORMAT_OPTIONS,
  toLocalInputValue,
} from "@data";

import AdminBanner from "@components/admin/AdminBanner";
import AdminListHeader from "@components/admin/AdminListHeader";
import AdminSideCard from "@components/admin/AdminSideCard";
import AdminPagination from "@components/admin/AdminPagination";

import { formatEventDateRange } from "@utils/date-range";

const DEFAULT_PAGE_SIZE = 10;

const emptyForm = () => ({
  title: "",
  slug: "",
  category: EVENT_CATEGORY_OPTIONS[0].value,
  format: EVENT_FORMAT_OPTIONS[0].value,
  start_at: "",
  end_at: "",
  location_name: "",
  location_url: "",
  is_featured: false,
  registration_url: "",
  summary: "",
  description: "",
  cover_url: "",
});

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
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

  const [editing, setEditing] = useState(null); // null = new
  const [form, setForm] = useState(emptyForm());

  // Load events
  const loadEvents = useCallback(async ({ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) => {
    const requestedPage = page;
    const requestedPageSize = pageSize;

    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      let { items, total } = await adminFetchEventsPage({
        page: requestedPage,
        pageSize: requestedPageSize,
      });

      const totalPages = Math.max(1, Math.ceil(total / requestedPageSize));
      let nextPage = requestedPage;

      if (total > 0 && requestedPage > totalPages) {
        nextPage = totalPages;
        const fallback = await adminFetchEventsPage({
          page: nextPage,
          pageSize: requestedPageSize,
        });
        items = fallback.items;
        total = fallback.total;
      }

      if (total === 0) {
        nextPage = 1;
      }

      setEvents(items);
      setPagination({
        currentPage: nextPage,
        pageSize: requestedPageSize,
        totalItems: total,
      });
    } catch (err) {
      logger.error("Error loading events (admin):", err);
      setErrorMsg(
        err.message ||
          "Failed to load events. Please try again or contact an admin.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  }, [loadEvents]);

  useEffect(
    () => () => {
      if (coverPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(coverPreviewUrl);
      }
    },
    [coverPreviewUrl],
  );

  const resetForm = () => {
    setEditing(null);
    setForm(emptyForm());
    setCoverFile(null);
    setCoverPreviewUrl((previous) => {
      if (previous?.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }
      return "";
    });
  };

  const handleEdit = (ev) => {
    setEditing(ev);
    setErrorMsg("");
    setSuccessMsg("");

    setForm({
      title: ev.title || "",
      slug: ev.slug || "",
      category: ev.category || EVENT_CATEGORY_OPTIONS[0].value,
      format: ev.format || EVENT_FORMAT_OPTIONS[0].value,
      start_at: toLocalInputValue(ev.start_at),
      end_at: toLocalInputValue(ev.end_at),
      location_name: ev.location_name || "",
      location_url: ev.location_url || "",
      is_featured: !!ev.is_featured,
      registration_url: ev.registration_url || "",
      summary: ev.summary || "",
      description: ev.description || "",
      cover_url: ev.cover_url || "",
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
    const { name, value, type, checked } = e.target;
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await adminUpsertEvent({
        ...(editing ? { id: editing.id } : {}),
        ...form,
        imageFile: coverFile,
        previous_cover_url: editing?.cover_url || null,
      });

      await loadEvents({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
      });
      setSuccessMsg("Event saved successfully.");
      resetForm();
    } catch (err) {
      logger.error("Error saving event:", err);
      setErrorMsg(err.message || "Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ev) => {
    if (!window.confirm(`Delete event "${ev.title}"? This cannot be undone.`)) {
      return;
    }

    try {
      await adminDeleteEvent(ev.id);
      await loadEvents({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
      });
      setSuccessMsg("Event deleted.");
      if (editing && editing.id === ev.id) {
        resetForm();
      }
    } catch (err) {
      logger.error("Error deleting event:", err);
      setErrorMsg("Failed to delete event.");
    }
  };

  const isEditing = Boolean(editing);

  return (
    <AdminLayout
      title="Events"
      description="Create, edit, and organize RoboTUM events."
    >
      <AdminBanner message={errorMsg} />
      <AdminBanner message={successMsg} tone="success" />

      <div className="grid gap-8 lg:grid-cols-[2fr_minmax(0,1.4fr)] items-start">
        {/* LEFT: list of events */}
        <div>
          <AdminListHeader
            title="Existing events"
            buttonLabel="+ New event"
            onButtonClick={resetForm}
          />

          {loading ? (
            <p className="text-sm text-white/60">Loading events…</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-white/60">
              No events yet. Create the first one on the right.
            </p>
          ) : (
            <ul className="space-y-3">
              {events.map((ev) => {
                const isPast = new Date(ev.end_at || ev.start_at) < new Date();
                return (
                  <li
                    key={ev.id}
                    className="flex items-start justify-between gap-3 card-surface card-surface-hover px-4 py-3"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-white">
                          {ev.title}
                        </p>
                        {ev.is_featured && (
                          <span className="inline-flex items-center rounded-full bg-yellow-500/20 text-yellow-200 border border-yellow-500/40 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                            Featured
                          </span>
                        )}
                        {isPast && (
                          <span className="inline-flex items-center rounded-full bg-white/10 text-white/70 border border-white/25 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                            Past
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-white/60">
                        {formatEventDateRange(ev.start_at, ev.end_at)} ·{" "}
                        {ev.location_name}
                      </p>

                      <div className="flex flex-wrap gap-1 mt-1">
                        {ev.category && (
                          <span className="inline-flex items-center rounded-full bg-white/10 text-white/70 border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                            {ev.category}
                          </span>
                        )}
                        {ev.format && (
                          <span className="inline-flex items-center rounded-full bg-white/5 text-white/60 border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                            {ev.format}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-white/60 line-clamp-2 mt-1">
                        {ev.summary}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <Button
                        size="xs"
                        variant="secondary"
                        onClick={() => handleEdit(ev)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="xs"
                        variant="danger"
                        onClick={() => handleDelete(ev)}
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {!loading && (
            <AdminPagination
              currentPage={pagination.currentPage}
              pageSize={pagination.pageSize}
              totalItems={pagination.totalItems}
              onPageChange={(nextPage) =>
                loadEvents({ page: nextPage, pageSize: pagination.pageSize })
              }
              onPageSizeChange={(nextPageSize) =>
                loadEvents({ page: 1, pageSize: nextPageSize })
              }
            />
          )}
        </div>

        {/* RIGHT: form */}
        <AdminSideCard
          title={isEditing ? "Edit event" : "New event"}
          description={
            isEditing
              ? "Update event details, schedule, and homepage visibility."
              : "Create a new event that will appear on the events page and homepage."
          }
        >
          <form className="space-y-4" onSubmit={handleSave}>
            {/* Title + slug */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="ev-title">
                Title
              </label>
              <input
                id="ev-title"
                name="title"
                type="text"
                required
                value={form.title}
                onChange={handleChange}
                className="field-input"
                placeholder="Robotics Kickoff 2025"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="ev-slug">
                Slug (URL)
              </label>
              <input
                id="ev-slug"
                name="slug"
                type="text"
                value={form.slug}
                onChange={handleChange}
                className="field-input"
                placeholder="robotics-kickoff-2025"
              />
              <p className="text-[11px] text-white/40">
                If empty, it will be generated from the title.
              </p>
            </div>

            {/* Category + format */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/70" htmlFor="ev-category">
                  Category
                </label>
                <select
                  id="ev-category"
                  name="category"
                  required
                  value={form.category}
                  onChange={handleChange}
                  className="field-input"
                >
                  {EVENT_CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70" htmlFor="ev-format">
                  Format
                </label>
                <select
                  id="ev-format"
                  name="format"
                  required
                  value={form.format}
                  onChange={handleChange}
                  className="field-input"
                >
                  {EVENT_FORMAT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-white/70" htmlFor="ev-start">
                  Start (local time)
                </label>
                <input
                  id="ev-start"
                  name="start_at"
                  type="datetime-local"
                  required
                  value={form.start_at}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-white/70" htmlFor="ev-end">
                  End (local time)
                </label>
                <input
                  id="ev-end"
                  name="end_at"
                  type="datetime-local"
                  required
                  value={form.end_at}
                  onChange={handleChange}
                  className="field-input"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label
                className="text-xs text-white/70"
                htmlFor="ev-location-name"
              >
                Location name
              </label>
              <input
                id="ev-location-name"
                name="location_name"
                type="text"
                required
                value={form.location_name}
                onChange={handleChange}
                className="field-input"
                placeholder="Walter-Gropius-Straße 17, Munich"
              />
            </div>

            <div className="space-y-1">
              <label
                className="text-xs text-white/70"
                htmlFor="ev-location-url"
              >
                Location URL (e.g. Google Maps)
              </label>
              <input
                id="ev-location-url"
                name="location_url"
                type="url"
                value={form.location_url}
                onChange={handleChange}
                className="field-input"
                placeholder="https://maps.google.com/…"
              />
            </div>

            {/* Registration & cover */}
            <div className="space-y-1">
              <label
                className="text-xs text-white/70"
                htmlFor="ev-registration"
              >
                Registration URL
              </label>
              <input
                id="ev-registration"
                name="registration_url"
                type="url"
                required
                value={form.registration_url}
                onChange={handleChange}
                className="field-input"
                placeholder="https://…"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="ev-cover-file">
                Cover image
              </label>
              <input
                id="ev-cover-file"
                name="cover_file"
                type="file"
                accept="image/*"
                onChange={handleCoverFileChange}
                className="field-input"
              />
              <p className="text-[11px] text-white/40">
                Upload a new image or keep the current one. Max file size: 10MB.
              </p>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] text-white/55" htmlFor="ev-cover">
                  Optional external URL fallback
                </label>
                <input
                  id="ev-cover"
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
                  <p className="text-[11px] text-white/50 mb-1">Preview:</p>
                  <div className="aspect-video w-full overflow-hidden rounded-md bg-black/60">
                    <img
                      src={coverPreviewUrl || form.cover_url}
                      alt="Event cover preview"
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Summary & description */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="ev-summary">
                Summary (short)
              </label>
              <textarea
                id="ev-summary"
                name="summary"
                rows={2}
                value={form.summary}
                onChange={handleChange}
                className="field-input resize-y"
                placeholder="One or two sentences shown on cards."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="ev-description">
                Description (full)
              </label>
              <textarea
                id="ev-description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                className="field-input resize-y"
                placeholder="Longer description for the event detail page."
              />
            </div>

            {/* Featured */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <label
                htmlFor="ev-featured"
                className="flex items-center gap-2 text-xs text-white/80 select-none"
              >
                <input
                  id="ev-featured"
                  name="is_featured"
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-white/30 bg-black/40 text-accent focus-visible:ring-2 focus-visible:ring-accent"
                />
                <span>Mark as featured (show on homepage)</span>
              </label>

              {editing && (
                <span className="text-[11px] text-white/40">
                  Event ID:{" "}
                  <span className="font-mono text-[10px]">
                    {editing.id.slice(0, 8)}…
                  </span>
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              {editing && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={resetForm}
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
                {saving ? "Saving…" : "Save event"}
              </Button>
            </div>
          </form>
        </AdminSideCard>
      </div>
    </AdminLayout>
  );
}
