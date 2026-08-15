// src/data/partnersApi.js
import { supabase } from "@lib/supabaseClient";
import { logger } from "@utils/logger";
import {
  deletePublicImageByUrl,
  getAdminImageUploadTarget,
  uploadPublicImage,
} from "./storageApi";

// Category options are NOT defined here - they come from the Supabase
// partner_category enum via `useEnumOptions`. See src/data/enumsApi.js.

const PARTNER_FIELDS = `
  id,
  created_at,
  name,
  category,
  logo_url,
  website_url,
  is_active,
  priority,
  slug
`;

// 🔹 Public: used by homepage/partners page
export async function fetchActivePartners() {
  const { data, error } = await supabase
    .from("partners")
    .select(PARTNER_FIELDS)
    .eq("is_active", true)
    .order("priority", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    logger.error("Error loading active partners:", error);
    throw error;
  }

  return data ?? [];
}

// 🔹 Admin: list all partners
export async function adminFetchPartners() {
  const { data, error } = await supabase
    .from("partners")
    .select(PARTNER_FIELDS)
    .order("priority", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    logger.error("Error loading partners (admin):", error);
    throw error;
  }

  return data ?? [];
}

export async function adminFetchPartnersPage({ page = 1, pageSize = 10 } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 10);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const { data, error, count } = await supabase
    .from("partners")
    .select(PARTNER_FIELDS, { count: "exact" })
    .order("priority", { ascending: true })
    .order("created_at", { ascending: true })
    .range(from, to);

  if (error) {
    logger.error("Error loading partners page (admin):", error);
    throw error;
  }

  return {
    items: data ?? [],
    total: count ?? 0,
  };
}

// 🔹 Admin: create or update a partner
export async function adminUpsertPartner(partner) {
  const priority =
    partner.priority === "" || partner.priority == null
      ? null
      : Number(partner.priority);

  let slug = (partner.slug || "").trim();
  if (!slug && partner.name) {
    slug = partner.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  let finalLogoUrl = partner.logo_url?.trim() || null;
  let uploadedStoragePath = null;
  if (partner.imageFile) {
    const uploadTarget = getAdminImageUploadTarget("partners");
    const { publicUrl, storagePath } = await uploadPublicImage({
      file: partner.imageFile,
      folderPath: uploadTarget.folderPath,
      slug,
    });
    finalLogoUrl = publicUrl;
    uploadedStoragePath = storagePath;
  }

  const previousLogoUrl = partner.previous_logo_url?.trim() || null;

  const payload = {
    name: partner.name?.trim(),
    category: partner.category, // MUST match partner_category enum
    logo_url: finalLogoUrl,
    website_url: partner.website_url?.trim() || null,
    is_active: !!partner.is_active,
    priority,
    slug,
  };

  if (!payload.name) {
    throw new Error("Name is required.");
  }
  if (!payload.category) {
    throw new Error("Category is required.");
  }
  if (!payload.slug) {
    throw new Error("Slug is required.");
  }

  if (partner.id) {
    const { error } = await supabase
      .from("partners")
      .update(payload)
      .eq("id", partner.id);

    if (error) {
      logger.error("Error updating partner:", error);
      throw error;
    }

    if (
      partner.imageFile &&
      previousLogoUrl &&
      previousLogoUrl !== finalLogoUrl
    ) {
      await deletePublicImageByUrl({
        publicUrl: previousLogoUrl,
        exceptStoragePath: uploadedStoragePath,
      });
    }
  } else {
    const { error } = await supabase.from("partners").insert(payload);
    if (error) {
      logger.error("Error inserting partner:", error);
      throw error;
    }
  }
}

// 🔹 Admin: delete
export async function adminDeletePartner(id) {
  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) {
    logger.error("Error deleting partner:", error);
    throw error;
  }
}
