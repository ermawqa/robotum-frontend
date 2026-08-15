// src/data/faqsApi.js
import { supabase } from "@lib/supabaseClient";
import { logger } from "@utils/logger";

// Category options are NOT defined here - they come from the Supabase
// faq_category enum via `useEnumOptions`. See src/data/enumsApi.js.

const FAQ_SELECT = `
  id,
  created_at,
  question,
  answer,
  category
`;

export async function fetchFaqs() {
  // You can change order if you later add a sort_order column
  const { data, error } = await supabase
    .from("faqs")
    .select(FAQ_SELECT)
    .order("created_at", { ascending: true });

  if (error) {
    logger.error("Error loading FAQs:", error);
    throw error;
  }

  return data ?? [];
}

export async function adminFetchFaqs() {
  const { data, error } = await supabase
    .from("faqs")
    .select(FAQ_SELECT)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function adminFetchFaqsPage({ page = 1, pageSize = 10 } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 10);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const { data, error, count } = await supabase
    .from("faqs")
    .select(FAQ_SELECT, { count: "exact" })
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error) throw error;

  return {
    items: data ?? [],
    total: count ?? 0,
  };
}

export async function adminUpsertFaq(faq) {
  const payload = {
    question: faq.question.trim(),
    answer: faq.answer.trim(),
    category: faq.category.trim(), // enum, NOT NULL
  };

  if (faq.id) {
    const { error } = await supabase
      .from("faqs")
      .update(payload)
      .eq("id", faq.id);
    if (error) throw error;
  } else {
    const { error } = await supabase.from("faqs").insert(payload);
    if (error) throw error;
  }
}

export async function adminDeleteFaq(id) {
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
}
