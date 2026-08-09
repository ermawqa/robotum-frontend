import { supabase } from "@lib/supabaseClient";
import { logger } from "@utils/logger";

// Must match the Supabase Storage bucket name exactly ("assets", not "asset") -
// a mismatch makes every admin upload fail with "Bucket not found".
export const ADMIN_ASSET_BUCKET = "assets";
export const MAX_IMAGE_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const ADMIN_IMAGE_TARGETS = {
  events: { folderPath: "events/covers" },
  projects: { folderPath: "projects/covers" },
  partners: { folderPath: "partners/logos" },
  members: { folderPath: "members/covers" },
};

const MANAGED_FOLDERS = [
  "events/covers",
  "projects/covers",
  "partners/logos",
  "members/covers",
  "others",
];

function fallbackUniqueId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildUniqueId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return fallbackUniqueId();
}

function sanitizeSlugSegment(value) {
  const slug = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "image";
}

function sanitizeBaseName(fileName) {
  return sanitizeSlugSegment(fileName.replace(/\.[^/.]+$/, ""));
}

function resolveFileExtension(file) {
  if (file?.name && /\.[^/.]+$/.test(file.name)) {
    return file.name.split(".").pop().toLowerCase();
  }

  if (file?.type?.startsWith("image/")) {
    const subtype = file.type.split("/")[1];
    return subtype === "jpeg" ? "jpg" : subtype;
  }

  return "bin";
}

/**
 * Name the object after the entity slug so the bucket stays readable and
 * matches files uploaded by hand (e.g. `projects/covers/website-development.png`).
 * Without a slug we fall back to a unique name — two unrelated uploads must
 * never be able to collide on the same path.
 */
function createStoragePath(folderPath, file, slug) {
  const extension = resolveFileExtension(file);

  if (slug) {
    return `${folderPath}/${sanitizeSlugSegment(slug)}.${extension}`;
  }

  const baseName = sanitizeBaseName(file?.name || "image");
  return `${folderPath}/${Date.now()}-${buildUniqueId()}-${baseName}.${extension}`;
}

/**
 * Slug-based names are deterministic, so replacing a cover reuses the same URL
 * and Supabase's CDN would keep serving the old image. A version query param
 * keeps the stored filename clean while still busting the cache.
 */
function withCacheBuster(publicUrl) {
  const separator = publicUrl.includes("?") ? "&" : "?";
  return `${publicUrl}${separator}v=${Date.now()}`;
}

function ensureValidImageFile(file) {
  if (!file) {
    throw new Error("Please select an image file.");
  }

  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    throw new Error("Image must be 10MB or smaller.");
  }
}

function tryParsePublicStoragePath(url, bucketName) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    const marker = `/object/public/${bucketName}/`;
    const markerIndex = parsedUrl.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    const encodedPath = parsedUrl.pathname.slice(markerIndex + marker.length);
    return decodeURIComponent(encodedPath);
  } catch {
    return null;
  }
}

function isManagedFolderPath(storagePath) {
  return MANAGED_FOLDERS.some(
    (folderPath) =>
      storagePath === folderPath || storagePath.startsWith(`${folderPath}/`),
  );
}

// Supabase storage errors are opaque in production (logger is silent there), so
// map the ones admins can act on to a message the dashboard can show directly.
function describeUploadError(uploadError) {
  const rawMessage = uploadError?.message || "";
  const normalized = rawMessage.toLowerCase();

  if (normalized.includes("bucket not found")) {
    return `Storage bucket "${ADMIN_ASSET_BUCKET}" was not found. Ask a site admin to check the Supabase bucket name.`;
  }

  if (normalized.includes("row-level security") || normalized.includes("unauthorized")) {
    return "You are not allowed to upload images. Your admin session may have expired - sign out, sign back in, and try again.";
  }

  if (normalized.includes("mime type")) {
    return "That image format is not allowed. Please upload a PNG, JPG, WEBP, or SVG file.";
  }

  if (normalized.includes("exceeded") || normalized.includes("too large")) {
    return "Image is too large for the storage bucket. Please upload a smaller file.";
  }

  if (normalized.includes("duplicate") || normalized.includes("already exists")) {
    return "An image with that name already exists. Please rename the file and try again.";
  }

  return rawMessage
    ? `Failed to upload image: ${rawMessage}`
    : "Failed to upload image. Please try again.";
}

export function getAdminImageUploadTarget(entityName) {
  return ADMIN_IMAGE_TARGETS[entityName] || { folderPath: "others" };
}

export async function uploadPublicImage({
  file,
  folderPath,
  slug,
  bucketName = ADMIN_ASSET_BUCKET,
}) {
  ensureValidImageFile(file);

  if (!folderPath) {
    throw new Error("Missing storage folder path for image upload.");
  }

  const storagePath = createStoragePath(folderPath, file, slug);
  const { error: uploadError } = await supabase
    .storage
    .from(bucketName)
    .upload(storagePath, file, {
      cacheControl: "3600",
      // Slug-based paths repeat when a cover is replaced, so overwrite instead
      // of failing with "already exists".
      upsert: true,
      contentType: file.type || undefined,
    });

  if (uploadError) {
    logger.error("Error uploading image to storage:", uploadError);
    throw new Error(describeUploadError(uploadError));
  }

  const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
  if (!data?.publicUrl) {
    throw new Error("Failed to create a public URL for the uploaded image.");
  }

  return {
    publicUrl: withCacheBuster(data.publicUrl),
    storagePath,
    bucketName,
  };
}

export async function deletePublicImageByUrl({
  publicUrl,
  exceptStoragePath,
  bucketName = ADMIN_ASSET_BUCKET,
}) {
  if (!publicUrl) return false;

  const storagePath = tryParsePublicStoragePath(publicUrl, bucketName);
  if (!storagePath || !isManagedFolderPath(storagePath)) {
    return false;
  }

  // Slug-based names mean a replacement usually reuses the same object. The
  // old URL then points at the file we just uploaded — deleting it would wipe
  // the new cover. Only remove the previous file when the path really changed
  // (slug renamed, or a different file extension).
  if (exceptStoragePath && storagePath === exceptStoragePath) {
    return false;
  }

  const { error } = await supabase.storage.from(bucketName).remove([storagePath]);
  if (error) {
    logger.warn("Failed to delete old storage image:", error);
    return false;
  }

  return true;
}
