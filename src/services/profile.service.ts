import { supabase } from "./supabase";
import { createServiceError } from "@/types";
import type { Profile, UpdateProfile } from "@/types";

const TABLE = "profiles";

/** Default empty profile for when no row exists yet. */
function defaultProfile(userId: string): Profile {
  const now = new Date().toISOString();
  return {
    id: userId,
    full_name: "",
    phone: "",
    avatar_url: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
    updated_at: now,
    created_at: now,
  };
}

/**
 * Fetch the profile for the given user.
 * Uses maybeSingle() to avoid 406 errors when the row doesn't exist.
 * If no row is found, returns a default empty profile — the row will
 * be created on first save via upsert in updateProfile().
 */
export async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw createServiceError(error.message, error.code);

  // No profile row yet → return defaults (will be created on save)
  if (!data) return defaultProfile(userId);

  return data;
}

/**
 * Update (or create) the profile for the given user.
 * Uses upsert so the row is created if it doesn't exist yet.
 */
export async function updateProfile(
  userId: string,
  updates: Omit<UpdateProfile, "id" | "created_at">,
): Promise<Profile> {
  const { data, error } = await supabase
    .from(TABLE)
    .upsert({ id: userId, ...updates, updated_at: new Date().toISOString() })
    .select("*")
    .single();

  if (error) throw createServiceError(error.message, error.code);
  return data;
}
