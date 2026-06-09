import { supabase } from "./supabase";
import { createServiceError } from "@/types";
import type { Profile, UpdateProfile } from "@/types";

const TABLE = "profiles";

/**
 * Fetch the profile for the given user.
 * If no profile row exists (legacy user), auto-creates one via upsert.
 */
export async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    // Row doesn't exist yet → create it
    if (error.code === "PGRST116") {
      const { data: created, error: insertError } = await supabase
        .from(TABLE)
        .upsert({ id: userId })
        .select("*")
        .single();

      if (insertError) throw createServiceError(insertError.message, insertError.code);
      return created;
    }
    throw createServiceError(error.message, error.code);
  }

  return data;
}

/** Update the profile for the given user. */
export async function updateProfile(
  userId: string,
  updates: Omit<UpdateProfile, "id" | "created_at">,
): Promise<Profile> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select("*")
    .single();

  if (error) throw createServiceError(error.message, error.code);
  return data;
}
