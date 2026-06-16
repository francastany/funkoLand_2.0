import { supabase } from "./supabase";
import { createServiceError } from "@/types";

const TABLE = "wishlists";

/** Fetch all funko IDs in the user's wishlist. */
export async function fetchWishlist(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("funko_id")
    .eq("user_id", userId);

  if (error) throw createServiceError(error.message, error.code);
  return (data ?? []).map((row) => row.funko_id);
}

/** Add a funko to the user's wishlist. Ignores duplicates. */
export async function addToWishlist(
  userId: string,
  funkoId: number,
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .upsert({ user_id: userId, funko_id: funkoId }, { onConflict: "user_id,funko_id" });

  if (error) throw createServiceError(error.message, error.code);
}

/** Remove a funko from the user's wishlist. */
export async function removeFromWishlist(
  userId: string,
  funkoId: number,
): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("user_id", userId)
    .eq("funko_id", funkoId);

  if (error) throw createServiceError(error.message, error.code);
}

/** Fetch wishlist items with full funko details, ordered by newest first. */
export async function fetchWishlistWithFunkos(userId: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("funko_id, created_at, funkos(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw createServiceError(error.message, error.code);
  return (data ?? [])
    .filter((row) => row.funkos != null)
    .map((row) => row.funkos!);
}
