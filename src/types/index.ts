import type { Tables, TablesInsert, TablesUpdate } from "./database.types";

// ---------------------------------------------------------------------------
// Funko
// ---------------------------------------------------------------------------

/** A Funko row exactly as it comes from the database. */
export type Funko = Tables<"funkos">;

/** Payload for creating a new Funko (id and created_at are auto-generated). */
export type NewFunko = TablesInsert<"funkos">;

/** Payload for partially updating an existing Funko. */
export type UpdateFunko = TablesUpdate<"funkos">;

// ---------------------------------------------------------------------------
// Cart
// ---------------------------------------------------------------------------

export type CartItem = {
  id: number;
  name: string;
  image?: string | null;
  price: number;
  quantity: number;
  details?: string;
};

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

/** An Order row exactly as it comes from the database. */
export type Order = Tables<"orders">;

/** Payload for creating a new Order. */
export type NewOrder = TablesInsert<"orders">;

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

/** A Profile row exactly as it comes from the database. */
export type Profile = Tables<"profiles">;

/** Payload for creating a new Profile. */
export type NewProfile = TablesInsert<"profiles">;

/** Payload for partially updating an existing Profile. */
export type UpdateProfile = TablesUpdate<"profiles">;

// ---------------------------------------------------------------------------
// Wishlist
// ---------------------------------------------------------------------------

/** A Wishlist row exactly as it comes from the database. */
export type WishlistItem = Tables<"wishlists">;

// ---------------------------------------------------------------------------
// Service Errors
// ---------------------------------------------------------------------------

/** Standardised error shape thrown by all service functions. */
export interface ServiceError extends Error {
  readonly code?: string;
}

/** Create a ServiceError instance. */
export function createServiceError(
  message: string,
  code?: string,
): ServiceError {
  const error = new Error(message) as ServiceError;
  error.name = "ServiceError";
  (error as { code?: string }).code = code;
  return error;
}
