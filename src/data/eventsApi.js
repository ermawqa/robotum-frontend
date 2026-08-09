// src/data/eventsApi.js
import { supabase } from "@lib/supabaseClient";
import { logger } from "@utils/logger";
import {
  deletePublicImageByUrl,
  getAdminImageUploadTarget,
  uploadPublicImage,
} from "./storageApi";

// Adjust these to match your Supabase enums
export const EVENT_CATEGORY_OPTIONS = [
  { value: "Workshop", label: "Workshop" },
  { value: "Tech & Robotics", label: "Tech & Robotics" },
  { value: "Social & Community", label: "Social & Community" },
  { value: "Hackathon", label: "Hackathon" },
  { value: "Info & Orientation", label: "Info & Orientation" },
];

export const EVENT_FORMAT_OPTIONS = [
  { value: "Offline", label: "Offline" },
  { value: "Online", label: "Online" },
];

// helper to convert ISO (or timestamptz string) -> datetime-local value
export function toLocalInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  // YYYY-MM-DDTHH:mm in *browser local* time. `datetime-local` inputs are
  // read back as local time (adminUpsertEvent does `new Date(...).toISOString()`),
  // so formatting with toISOString() here would shift the event by the UTC
  // offset on every edit-and-save round trip.
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

const EVENT_FIELDS = `
  id,
  created_at,
  title,
  slug,
  location_name,
  location_url,
  category,
  is_featured,
  cover_url,
  description,
  summary,
  registration_url,
  start_at,
  end_at,
  format
`;

// ---------- PUBLIC HELPERS ----------

// List all events (for Events page)
export async function fetchEvents() {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_FIELDS)
    .order("start_at", { ascending: true });

  if (error) {
    logger.error("Error loading events:", error);
    throw error;
  }

  return data ?? [];
}
// ✅ used on homepage
export async function fetchEventsForHomepage() {
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .select(EVENT_FIELDS)
    .gte("end_at", nowIso) // upcoming / ongoing
    .order("start_at", { ascending: true })
    .limit(3);

  if (error) {
    logger.error("Error loading homepage events:", error);
    throw error;
  }

  return data ?? [];
}

// Single event by slug (for EventDetail page)
export async function fetchEventBySlug(slug) {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_FIELDS)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    logger.error("Error loading event by slug:", error);
    throw error;
  }

  return data; // can be null
}

// ---------- ADMIN HELPERS ----------

// Admin: list all events (no filtering)
export async function adminFetchEvents() {
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_FIELDS)
    .order("start_at", { ascending: false });

  if (error) {
    logger.error("Error loading events (admin):", error);
    throw error;
  }

  return data ?? [];
}

export async function adminFetchEventsPage({ page = 1, pageSize = 10 } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safePageSize = Math.max(1, Number(pageSize) || 10);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const { data, error, count } = await supabase
    .from("events")
    .select(EVENT_FIELDS, { count: "exact" })
    .order("start_at", { ascending: false })
    .range(from, to);

  if (error) {
    logger.error("Error loading events page (admin):", error);
    throw error;
  }

  return {
    items: data ?? [],
    total: count ?? 0,
  };
}

// Admin: create or update event
export async function adminUpsertEvent(event) {
  // Normalize / generate slug
  let slug = (event.slug || "").trim();
  if (!slug && event.title) {
    slug = event.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // Handle datetime-local values from the form
  // (if you pass strings like "2025-03-10T18:30", Postgres will parse them)
  const start_at = event.start_at
    ? new Date(event.start_at).toISOString()
    : null;
  const end_at = event.end_at ? new Date(event.end_at).toISOString() : null;

  let finalCoverUrl = event.cover_url?.trim() || null;
  if (event.imageFile) {
    const uploadTarget = getAdminImageUploadTarget("events");
    const { publicUrl } = await uploadPublicImage({
      file: event.imageFile,
      folderPath: uploadTarget.folderPath,
    });
    finalCoverUrl = publicUrl;
  }

  const previousCoverUrl = event.previous_cover_url?.trim() || null;

  const payload = {
    title: event.title?.trim(),
    slug,
    location_name: event.location_name?.trim(),
    location_url: event.location_url?.trim() || null,
    category: event.category, // must match event_category enum
    is_featured: !!event.is_featured,
    cover_url: finalCoverUrl,
    description: event.description?.trim() || "",
    summary: event.summary?.trim() || "",
    registration_url: event.registration_url?.trim() || "",
    start_at,
    end_at,
    format: event.format, // must match event_format enum
  };

  if (!payload.title) throw new Error("Title is required.");
  if (!payload.slug) throw new Error("Slug is required.");
  if (!payload.category) throw new Error("Category is required.");
  if (!payload.format) throw new Error("Format is required.");
  if (!payload.start_at) throw new Error("Start date/time is required.");
  if (!payload.end_at) throw new Error("End date/time is required.");
  if (!payload.location_name) throw new Error("Location name is required.");
  if (!payload.registration_url)
    throw new Error("Registration URL is required.");
  if (!payload.cover_url) throw new Error("Cover image is required.");

  if (event.id) {
    const { error } = await supabase
      .from("events")
      .update(payload)
      .eq("id", event.id);

    if (error) {
      logger.error("Error updating event:", error);
      throw error;
    }

    if (event.imageFile && previousCoverUrl && previousCoverUrl !== finalCoverUrl) {
      await deletePublicImageByUrl({ publicUrl: previousCoverUrl });
    }
  } else {
    const { error } = await supabase.from("events").insert(payload);
    if (error) {
      logger.error("Error inserting event:", error);
      throw error;
    }
  }
}

// Admin: delete event
export async function adminDeleteEvent(id) {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) {
    logger.error("Error deleting event:", error);
    throw error;
  }
}
