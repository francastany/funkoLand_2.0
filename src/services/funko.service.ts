import { supabase } from "./supabase";
import { createServiceError } from "@/types";
import type { Funko, NewFunko, UpdateFunko } from "@/types";

// const TABLE = "funkos" as const;
const TABLE = "funkos";

// ---------------------------------------------------------------------------
// Read
// ---------------------------------------------------------------------------

/** Fetch all funkos, ordered by newest first. */
export async function fetchAllFunkos(): Promise<Funko[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw createServiceError(error.message, error.code);
  return data ?? [];
}

/** Fetch a single funko by its ID, or `null` if not found. */
export async function fetchFunkoById(id: number): Promise<Funko | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    // PGRST116 = "no rows returned" — treat as not-found rather than a crash
    if (error.code === "PGRST116") return null;
    throw createServiceError(error.message, error.code);
  }
  return data;
}

/** Fetch only featured funkos (filtered at DB level). */
export async function fetchFeaturedFunkos(): Promise<Funko[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) throw createServiceError(error.message, error.code);
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Write
// ---------------------------------------------------------------------------

/** Create a new funko and return the inserted row. */
export async function createFunko(payload: NewFunko): Promise<Funko> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(payload)
    .select("*")
    .single();

  if (error) throw createServiceError(error.message, error.code);
  return data;
}

/** Update an existing funko and return the updated row. */
export async function updateFunko(
  id: number,
  updates: UpdateFunko,
): Promise<Funko> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw createServiceError(error.message, error.code);
  return data;
}

/** Delete a funko by ID. Returns `true` on success. */
export async function deleteFunko(id: number): Promise<boolean> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) throw createServiceError(error.message, error.code);
  return true;
}
