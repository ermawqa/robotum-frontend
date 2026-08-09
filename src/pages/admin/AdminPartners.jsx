import { useCallback, useEffect, useState } from "react";
import { logger } from "@utils/logger";
import AdminLayout from "@components/admin/AdminLayout";
import Button from "@components/ui/Button";

import {
  adminFetchPartnersPage,
  adminUpsertPartner,
  adminDeletePartner,
  PARTNER_CATEGORIES,
} from "@data";

import AdminBanner from "@components/admin/AdminBanner";
import AdminListHeader from "@components/admin/AdminListHeader";
import AdminSideCard from "@components/admin/AdminSideCard";
import AdminPagination from "@components/admin/AdminPagination";

const DEFAULT_PAGE_SIZE = 10;

const emptyForm = () => ({
  name: "",
  category: PARTNER_CATEGORIES[0].value,
  logo_url: "",
  website_url: "",
  is_active: true,
  priority: "",
  slug: "",
});

export default function AdminPartners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: 0,
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("");

  const [editingPartner, setEditingPartner] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const loadPartners = useCallback(async ({ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) => {
    const requestedPage = page;
    const requestedPageSize = pageSize;

    setLoading(true);
    setErrorMsg("");

    try {
      let { items, total } = await adminFetchPartnersPage({
        page: requestedPage,
        pageSize: requestedPageSize,
      });

      const totalPages = Math.max(1, Math.ceil(total / requestedPageSize));
      let nextPage = requestedPage;

      if (total > 0 && requestedPage > totalPages) {
        nextPage = totalPages;
        const fallback = await adminFetchPartnersPage({
          page: nextPage,
          pageSize: requestedPageSize,
        });
        items = fallback.items;
        total = fallback.total;
      }

      if (total === 0) {
        nextPage = 1;
      }

      setPartners(items);
      setPagination({
        currentPage: nextPage,
        pageSize: requestedPageSize,
        totalItems: total,
      });
    } catch (error) {
      logger.error("Error loading partners:", error);
      setErrorMsg("Failed to load partners.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPartners({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  }, [loadPartners]);

  useEffect(
    () => () => {
      if (logoPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(logoPreviewUrl);
      }
    },
    [logoPreviewUrl],
  );

  const startNew = () => {
    setEditingPartner(null);
    setForm(emptyForm());
    setLogoFile(null);
    setLogoPreviewUrl((previous) => {
      if (previous?.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }
      return "";
    });
  };

  const startEdit = (partner) => {
    setEditingPartner(partner);
    setSuccessMsg("");
    setForm({
      name: partner.name || "",
      category: partner.category || PARTNER_CATEGORIES[0].value,
      logo_url: partner.logo_url || "",
      website_url: partner.website_url || "",
      is_active: partner.is_active ?? true,
      priority: partner.priority ?? "",
      slug: partner.slug || "",
    });

    setLogoFile(null);
    setLogoPreviewUrl((previous) => {
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

  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    setLogoFile(file);
    setLogoPreviewUrl((previous) => {
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
      await adminUpsertPartner({
        id: editingPartner?.id,
        ...form,
        imageFile: logoFile,
        previous_logo_url: editingPartner?.logo_url || null,
      });
      await loadPartners({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
      });
      startNew();
      setSuccessMsg("Partner saved successfully.");
    } catch (err) {
      logger.error("Error saving partner:", err);
      setErrorMsg(err.message || "Failed to save partner.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (partner) => {
    if (!window.confirm(`Delete partner "${partner.name}"?`)) return;

    try {
      await adminDeletePartner(partner.id);
      await loadPartners({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
      });
      setSuccessMsg("Partner deleted.");
    } catch (error) {
      logger.error("Error deleting partner:", error);
      setErrorMsg("Failed to delete partner.");
    }
  };

  const isEditing = Boolean(editingPartner);

  return (
    <AdminLayout
      title="Partners"
      description="Manage RoboTUM partners shown on the public site."
    >
      <AdminBanner message={errorMsg} />
      <AdminBanner message={successMsg} tone="success" />

      <div className="grid gap-8 md:grid-cols-[2fr_minmax(0,1.6fr)] items-start">
        {/* List */}
        <div>
          <AdminListHeader
            title="Existing partners"
            buttonLabel="+ New partner"
            onButtonClick={startNew}
          />

          {loading ? (
            <p className="text-sm text-white/60">Loading…</p>
          ) : partners.length === 0 ? (
            <p className="text-sm text-white/60">
              No partners yet. Create the first one on the right.
            </p>
          ) : (
            <ul className="space-y-3">
              {partners.map((partner) => (
                <li
                  key={partner.id}
                  className="flex items-start justify-between gap-3 card-surface card-surface-hover px-4 py-3"
                >
                  <div className="flex gap-3">
                    {partner.logo_url && (
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
                        <img
                          src={partner.logo_url}
                          alt={partner.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">
                          {partner.name}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] border ${
                            partner.is_active
                              ? "border-emerald-400/40 text-emerald-300 bg-emerald-500/10"
                              : "border-zinc-400/40 text-zinc-200 bg-zinc-500/10"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {partner.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60">
                        Category: {partner.category} • Priority:{" "}
                        {partner.priority ?? "-"}
                      </p>
                      <p className="text-[11px] text-white/50">
                        Slug:{" "}
                        <code className="text-white/70">{partner.slug}</code>
                      </p>
                      {partner.website_url && (
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-accent hover:underline break-all"
                        >
                          {partner.website_url}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => startEdit(partner)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="danger"
                      onClick={() => handleDelete(partner)}
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
                loadPartners({ page: nextPage, pageSize: pagination.pageSize })
              }
              onPageSizeChange={(nextPageSize) =>
                loadPartners({ page: 1, pageSize: nextPageSize })
              }
            />
          )}
        </div>

        {/* Form */}
        <AdminSideCard
          title={isEditing ? "Edit partner" : "New partner"}
          description={
            isEditing
              ? "Update partner details and visibility."
              : "Create a new partner entry for the public site."
          }
        >
          <form className="space-y-4" onSubmit={handleSave}>
            {/* Name */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="partner-name">
                Name
              </label>
              <input
                id="partner-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="field-input"
                placeholder="Company / organization name"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label
                className="text-xs text-white/70"
                htmlFor="partner-category"
              >
                Category
              </label>
              <select
                id="partner-category"
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                className="field-input"
              >
                {PARTNER_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Logo upload */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="partner-logo-file">
                Logo image
              </label>
              <input
                id="partner-logo-file"
                name="logo_file"
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                className="field-input"
              />
              <p className="text-[11px] text-white/40">
                Upload a new logo or keep the current one. Max file size: 10MB.
              </p>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] text-white/55" htmlFor="partner-logo">
                  Optional external URL fallback
                </label>
                <input
                  id="partner-logo"
                name="logo_url"
                type="url"
                value={form.logo_url}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent"
                placeholder="https://…"
              />

                {(logoPreviewUrl || form.logo_url) && (
                  <div className="mt-2 h-24 rounded-lg border border-white/10 bg-black/40 p-2">
                    <img
                      src={logoPreviewUrl || form.logo_url}
                      alt="Partner logo preview"
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Website URL */}
            <div className="space-y-1">
              <label
                className="text-xs text-white/70"
                htmlFor="partner-website"
              >
                Website URL
              </label>
              <input
                id="partner-website"
                name="website_url"
                type="url"
                value={form.website_url}
                onChange={handleChange}
                className="field-input"
                placeholder="https://…"
              />
            </div>

            {/* Priority + active */}
            <div className="flex gap-4 items-center">
              <div className="flex-1 space-y-1">
                <label
                  className="text-xs text-white/70"
                  htmlFor="partner-priority"
                >
                  Priority (lower = shown first)
                </label>
                <input
                  id="partner-priority"
                  name="priority"
                  type="number"
                  value={form.priority}
                  onChange={handleChange}
                  className="field-input"
                  placeholder="100"
                />
              </div>
              <div className="flex items-center gap-2 mt-5">
                <input
                  id="partner-active"
                  name="is_active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-white/40 bg-black/40"
                />
                <label
                  htmlFor="partner-active"
                  className="text-xs text-white/80"
                >
                  Visible on site
                </label>
              </div>
            </div>

            {/* Slug */}
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="partner-slug">
                Slug (URL identifier)
              </label>
              <input
                id="partner-slug"
                name="slug"
                type="text"
                value={form.slug}
                onChange={handleChange}
                className="field-input"
                placeholder="e.g. bosch, tum-ics, robotics-lab"
              />
              <p className="text-[11px] text-white/40">
                Used to uniquely identify this partner; must be unique.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              {isEditing && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={startNew}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save partner"}
              </Button>
            </div>
          </form>
        </AdminSideCard>
      </div>
    </AdminLayout>
  );
}
