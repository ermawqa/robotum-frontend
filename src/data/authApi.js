// src/data/authApi.js
// All Supabase Auth + admin-profile access lives here so UI components never
// touch `supabase.auth.*` or the `profiles` table directly.
import { supabase } from "@lib/supabaseClient";
import { logger } from "@utils/logger";

// Read the is_admin flag for a user id. Throws on query error.
async function fetchIsAdmin(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    logger.error("Error loading profile:", error);
    throw error;
  }
  return Boolean(data?.is_admin);
}

/**
 * Verify the current session belongs to an admin.
 * @returns {Promise<{ allowed: boolean, error: string }>}
 *   `error` is "" when simply not logged in (caller supplies a default prompt).
 */
export async function verifyAdminAccess() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    logger.error("Error getting session:", sessionError);
    return {
      allowed: false,
      error: "Failed to verify session. Please log in again.",
    };
  }

  if (!session) {
    return { allowed: false, error: "" };
  }

  try {
    const isAdmin = await fetchIsAdmin(session.user.id);
    if (!isAdmin) {
      logger.warn("Non-admin tried to access admin area.");
      return {
        allowed: false,
        error: "You don’t have permission to access the admin area.",
      };
    }
    return { allowed: true, error: "" };
  } catch {
    return {
      allowed: false,
      error: "Failed to load profile. Please contact an admin.",
    };
  }
}

/**
 * Sign in with email/password and require an admin profile.
 * Signs the user out automatically if the account is not an admin.
 * @returns {Promise<{ ok: boolean, error: string }>}
 */
export async function signInAdmin({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    logger.error("Login error:", error);
    return {
      ok: false,
      error: error.message || "Failed to sign in. Please try again.",
    };
  }

  const user = data.user;
  if (!user) {
    return { ok: false, error: "No user returned from sign-in." };
  }

  let isAdmin;
  try {
    isAdmin = await fetchIsAdmin(user.id);
  } catch {
    return {
      ok: false,
      error: "Could not load your profile. Please contact an admin.",
    };
  }

  if (!isAdmin) {
    // Not an admin → sign out for safety.
    await supabase.auth.signOut();
    return {
      ok: false,
      error: "You don’t have admin permissions for this site.",
    };
  }

  return { ok: true, error: "" };
}

// Current signed-in user's email, or "" if none / on error.
export async function getSessionEmail() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    logger.error("Failed to load admin session:", error);
    return "";
  }
  return data.session?.user?.email || "";
}

/**
 * Subscribe to auth state changes. The callback receives the current user
 * email (or ""). Returns the subscription - call `.unsubscribe()` to clean up.
 */
export function onAuthEmailChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user?.email || "");
  });
  return subscription;
}

// Sign out the current user.
export async function signOutAdmin() {
  await supabase.auth.signOut();
}
