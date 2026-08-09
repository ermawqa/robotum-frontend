import { useCallback, useEffect, useState } from "react";
import { logger } from "@utils/logger";
import AdminLayout from "@components/admin/AdminLayout";
import Button from "@components/ui/Button";

import {
  adminFetchFaqsPage,
  adminUpsertFaq,
  adminDeleteFaq,
  FAQ_CATEGORIES,
} from "@data";
import AdminBanner from "@components/admin/AdminBanner";
import AdminListHeader from "@components/admin/AdminListHeader";
import AdminSideCard from "@components/admin/AdminSideCard";
import AdminPagination from "@components/admin/AdminPagination";

const DEFAULT_PAGE_SIZE = 10;

export default function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    totalItems: 0,
  });

  const [editingFaq, setEditingFaq] = useState(null); // null = new
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: FAQ_CATEGORIES[0].value,
  });

  const loadFaqs = useCallback(async ({ page = 1, pageSize = DEFAULT_PAGE_SIZE } = {}) => {
    const requestedPage = page;
    const requestedPageSize = pageSize;

    setLoading(true);
    setErrorMsg("");

    try {
      let { items, total } = await adminFetchFaqsPage({
        page: requestedPage,
        pageSize: requestedPageSize,
      });

      const totalPages = Math.max(1, Math.ceil(total / requestedPageSize));
      let nextPage = requestedPage;

      if (total > 0 && requestedPage > totalPages) {
        nextPage = totalPages;
        const fallback = await adminFetchFaqsPage({
          page: nextPage,
          pageSize: requestedPageSize,
        });
        items = fallback.items;
        total = fallback.total;
      }

      if (total === 0) {
        nextPage = 1;
      }

      setFaqs(items);
      setPagination({
        currentPage: nextPage,
        pageSize: requestedPageSize,
        totalItems: total,
      });
    } catch (error) {
      logger.error("Error loading FAQs:", error);
      setErrorMsg("Failed to load FAQs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaqs({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  }, [loadFaqs]);

  const startNew = () => {
    setEditingFaq(null);
    setForm({
      question: "",
      answer: "",
      category: FAQ_CATEGORIES[0].value,
    });
  };

  const startEdit = (faq) => {
    setEditingFaq(faq);
    setForm({
      question: faq.question || "",
      answer: faq.answer || "",
      category: faq.category || FAQ_CATEGORIES[0].value,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await adminUpsertFaq({
        id: editingFaq?.id,
        ...form,
      });
      await loadFaqs({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
      });
      startNew();
      setSuccessMsg("FAQ saved successfully.");
    } catch (err) {
      logger.error("Error saving FAQ:", err);
      setErrorMsg(err.message || "Failed to save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (faq) => {
    if (!window.confirm("Delete this FAQ?")) return;

    try {
      await adminDeleteFaq(faq.id);
      await loadFaqs({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
      });
      setSuccessMsg("FAQ deleted.");
    } catch (error) {
      logger.error("Error deleting FAQ:", error);
      setErrorMsg("Failed to delete FAQ.");
    }
  };

  const isEditing = Boolean(editingFaq);

  return (
    <AdminLayout
      title="FAQs"
      description="Manage questions and answers shown on the public FAQ page."
    >
      <AdminBanner message={errorMsg} />
      <AdminBanner message={successMsg} tone="success" />

      <div className="grid gap-8 md:grid-cols-[2fr_minmax(0,1.5fr)] items-start">
        {/* List */}
        <div>
          <AdminListHeader
            title="Existing FAQs"
            buttonLabel="+ New FAQ"
            onButtonClick={startNew}
          />

          {loading ? (
            <p className="text-sm text-white/60">Loading…</p>
          ) : faqs.length === 0 ? (
            <p className="text-sm text-white/60">
              No FAQs yet. Create the first one on the right.
            </p>
          ) : (
            <ul className="space-y-3">
              {faqs.map((faq) => (
                <li
                  key={faq.id}
                  className="flex items-start justify-between gap-3 card-surface card-surface-hover px-4 py-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">
                      {faq.question}
                    </p>
                    {faq.category && (
                      <span className="inline-block text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/10">
                        {faq.category}
                      </span>
                    )}
                    <p className="text-xs text-white/60 line-clamp-2">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => startEdit(faq)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="xs"
                      variant="danger"
                      onClick={() => handleDelete(faq)}
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
                loadFaqs({ page: nextPage, pageSize: pagination.pageSize })
              }
              onPageSizeChange={(nextPageSize) =>
                loadFaqs({ page: 1, pageSize: nextPageSize })
              }
            />
          )}
        </div>

        {/* Form */}
        <AdminSideCard
          title={isEditing ? "Edit FAQ" : "New FAQ"}
          description={
            isEditing
              ? "Update the FAQ content and category."
              : "Create a new FAQ entry for the public page."
          }
        >
          <form className="space-y-4" onSubmit={handleSave}>
            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="faq-question">
                Question
              </label>
              <input
                id="faq-question"
                name="question"
                type="text"
                required
                value={form.question}
                onChange={handleChange}
                className="field-input"
                placeholder="What is RoboTUM?"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="faq-answer">
                Answer
              </label>
              <textarea
                id="faq-answer"
                name="answer"
                required
                rows={4}
                value={form.answer}
                onChange={handleChange}
                className="field-input resize-y"
                placeholder="RoboTUM is the official robotics student team at TUM…"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/70" htmlFor="faq-category">
                Category
              </label>
              <select
                id="faq-category"
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                className="field-input"
              >
                {FAQ_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

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
                {saving ? "Saving…" : "Save FAQ"}
              </Button>
            </div>
          </form>
        </AdminSideCard>
      </div>
    </AdminLayout>
  );
}
