// src/utils/formatCategory.js
// Category label formatting. Enum values come from Supabase, so labels are
// derived from the value instead of being hardcoded - a value added in the DB
// gets a sensible label without a code change.

// Title-case the first letter of each word: "next prototypes" -> "Next Prototypes".
function titleCase(str) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Turn any enum value into a display label.
 *
 * Values already written in display form (they contain a space or an uppercase
 * letter, e.g. "Tech & Robotics", "Lead Sponsors") are returned untouched.
 * Slug-style values are humanised: separators become spaces, a standalone
 * "and" becomes "&", and each word is title-cased.
 *   "lead_sponsors"                    -> "Lead Sponsors"
 *   "tech-talk"                        -> "Tech Talk"
 *   "innovation-and-entrepreneurship"  -> "Innovation & Entrepreneurship"
 */
export function formatEnumLabel(value, { fallback = "" } = {}) {
  if (value === null || value === undefined) return fallback;

  const str = String(value).trim();
  if (!str) return fallback;

  // Already human-readable - leave the DB's own wording alone.
  if (/\s/.test(str) || /[A-Z]/.test(str)) return str;

  return titleCase(
    str
      .toLowerCase()
      .replace(/[-_]+/g, " ")
      .replace(/\band\b/g, "&"),
  );
}

/**
 * Partner category labels. Empty -> "Partner".
 */
export function formatPartnerCategory(category) {
  return formatEnumLabel(category, { fallback: "Partner" });
}

/**
 * Event category labels. Empty -> options.fallback (default "Event").
 */
export function formatEventCategory(category, { fallback = "Event" } = {}) {
  return formatEnumLabel(category, { fallback });
}

/**
 * Project category labels. Empty -> "Project".
 */
export function formatProjectCategory(category) {
  return formatEnumLabel(category, { fallback: "Project" });
}
