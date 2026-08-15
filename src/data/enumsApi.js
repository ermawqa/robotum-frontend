// src/data/enumsApi.js
// Single source of truth for enum-backed dropdowns/filters.
//
// Values are read from Supabase at runtime via the `get_enum_values` RPC
// (see supabase/migrations/0001_get_enum_values.sql), so adding a value with
// `ALTER TYPE ... ADD VALUE ...` shows up on the site without a redeploy.
//
// Every enum also has a hardcoded fallback below. The fallback is what renders
// before the fetch resolves and if the fetch ever fails, so a network blip or a
// missing RPC degrades to today's behaviour instead of an empty dropdown.

import { supabase } from "@lib/supabaseClient";
import { logger } from "@utils/logger";
import { formatEnumLabel } from "@utils/formatCategory";

// Enum type names as defined in Postgres (public schema).
export const ENUM_TYPES = {
  PROJECT_CATEGORY: "project_category",
  PROJECT_STATUS: "project_status",
  EVENT_CATEGORY: "event_category",
  EVENT_FORMAT: "event_format",
  PARTNER_CATEGORY: "partner_category",
  FAQ_CATEGORY: "faq_category",
  MEMBERSHIP_TYPE: "membership_type",
};

/**
 * Last-known-good values, in the order Postgres declares them.
 * Only used until the live values arrive, or if the RPC is unavailable.
 */
const ENUM_FALLBACKS = {
  [ENUM_TYPES.PROJECT_CATEGORY]: [
    "technical",
    "operations",
    "innovation-and-entrepreneurship",
  ],
  [ENUM_TYPES.PROJECT_STATUS]: ["active", "paused", "completed"],
  [ENUM_TYPES.EVENT_CATEGORY]: [
    "Workshop",
    "Tech & Robotics",
    "Social & Community",
    "Hackathon",
    "Info & Orientation",
  ],
  // Declared order in Postgres is Online, then Offline.
  [ENUM_TYPES.EVENT_FORMAT]: ["Online", "Offline"],
  [ENUM_TYPES.PARTNER_CATEGORY]: [
    "Lead Sponsors",
    "Sponsors",
    "Industry Collaborators",
    "Academic Collaborators",
  ],
  [ENUM_TYPES.FAQ_CATEGORY]: [
    "About RoboTUM",
    "Membership & Recruitment",
    "Collaboration & Partnerships",
    "Contact",
  ],
  [ENUM_TYPES.MEMBERSHIP_TYPE]: [
    "Founders",
    "Department Heads",
    "Project Leads",
  ],
};

/**
 * Enums the site deliberately renders only a subset of.
 * `membership_type` also contains values (e.g. Seniors, Alumni) that exist in
 * the DB but are not shown in the About page team grid. Anything not listed
 * here shows every value the enum has.
 */
const ENUM_ALLOWLIST = {
  [ENUM_TYPES.MEMBERSHIP_TYPE]: [
    "Founders",
    "Department Heads",
    "Project Leads",
  ],
};

function toOptions(values) {
  return values.map((value) => ({ value, label: formatEnumLabel(value) }));
}

function applyAllowlist(enumType, values) {
  const allowed = ENUM_ALLOWLIST[enumType];
  if (!allowed) return values;
  // Keep the allowlist's order, but only for values the DB actually still has.
  return allowed.filter((value) => values.includes(value));
}

/**
 * Fallback options for an enum. Synchronous, so components can seed state with
 * it and always have a valid `options[0]` on first render.
 */
export function getFallbackEnumOptions(enumType) {
  return toOptions(applyAllowlist(enumType, ENUM_FALLBACKS[enumType] ?? []));
}

// Cached in-flight/resolved fetch, so the RPC runs once per page load even
// though several components ask for enums independently.
let enumsPromise = null;

/**
 * Fetch every public-schema enum as { [enumType]: string[] }.
 * Never throws - on failure it logs, clears the cache so a later mount can
 * retry, and resolves to {} which makes callers fall back.
 */
export function loadEnums({ force = false } = {}) {
  if (force) enumsPromise = null;

  if (!enumsPromise) {
    enumsPromise = supabase
      .rpc("get_enum_values")
      .then(({ data, error }) => {
        if (error) throw error;

        const map = {};
        for (const row of data ?? []) {
          const values = row?.enum_values;
          if (row?.enum_type && Array.isArray(values) && values.length > 0) {
            map[row.enum_type] = values;
          }
        }
        return map;
      })
      .catch((err) => {
        logger.error("Error loading enum values, using fallbacks:", err);
        enumsPromise = null; // allow a retry on the next mount
        return {};
      });
  }

  return enumsPromise;
}

/**
 * Options for one enum: `[{ value, label }]`, live values when available,
 * fallback values otherwise. Always resolves to a non-empty array for a
 * known enum.
 */
export async function fetchEnumOptions(enumType) {
  const all = await loadEnums();
  const live = all[enumType];

  if (!Array.isArray(live) || live.length === 0) {
    return getFallbackEnumOptions(enumType);
  }

  const values = applyAllowlist(enumType, live);
  return values.length > 0
    ? toOptions(values)
    : getFallbackEnumOptions(enumType);
}
