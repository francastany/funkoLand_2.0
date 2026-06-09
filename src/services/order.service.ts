import { supabase } from "./supabase";
import { createServiceError } from "@/types";
import type { CartItem, NewOrder, Order } from "@/types";
import handleEmails from "@/utils/resend";

const TABLE = "orders";

/** Fetch all orders, ordered by newest first. */
export async function fetchAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw createServiceError(error.message, error.code);
  return data ?? [];
}

/** Fetch a single order by its ID, or `null` if not found. */
export async function fetchOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw createServiceError(error.message, error.code);
  }
  return data;
}

export async function fetchOrdersByUser(userId: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw createServiceError(error.message, error.code);
  return data ?? [];
}

/** Create a new order, persist it, and send a confirmation email. */
export async function createOrder({
  buyer,
  items,
  total,
  userId,
}: {
  buyer: { name: string; email: string };
  items: CartItem[];
  total: number;
  userId?: string;
}): Promise<void> {
  const payload: NewOrder = { buyer, items, total, user_id: userId ?? null };

  const { error } = await supabase.from(TABLE).insert(payload);

  if (error) throw createServiceError(error.message, error.code);

  // Fire-and-forget: don't fail the order if the email errors.
  handleEmails({ email: buyer.email, name: buyer.name, funkos: items, total }).catch(
    console.error,
  );
}

export async function deleteOrder(id: string): Promise<boolean> {
  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) throw createServiceError(error.message, error.code);
  return true;
}
