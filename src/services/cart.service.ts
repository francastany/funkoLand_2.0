import type { CartItem } from "@/types";

const DEFAULT_STORAGE_KEY = "funkoland_cart";

// ---------------------------------------------------------------------------
// Local Storage helpers
// ---------------------------------------------------------------------------

/** Safely parse cart items from localStorage. Returns `null` if invalid. */
function parseStoredItems(value: string | null): CartItem[] | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (item: unknown) =>
        item != null &&
        typeof item === "object" &&
        "id" in item &&
        typeof (item as Record<string, unknown>).id === "number",
    ) as CartItem[];
  } catch {
    return null;
  }
}

/** Load cart items from localStorage. */
export function loadCart(storageKey = DEFAULT_STORAGE_KEY): CartItem[] {
  if (typeof window === "undefined") return [];
  return parseStoredItems(localStorage.getItem(storageKey)) ?? [];
}

/** Persist cart items to localStorage. */
export function saveCart(
  items: CartItem[],
  storageKey = DEFAULT_STORAGE_KEY,
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey, JSON.stringify(items));
}

/** Clear the cart from localStorage. */
export function clearStoredCart(storageKey = DEFAULT_STORAGE_KEY): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey);
}

// ---------------------------------------------------------------------------
// Future: Supabase cart sync (Phase 2 — requires auth)
// ---------------------------------------------------------------------------
// export async function loadServerCart(userId: string): Promise<CartItem[]> { ... }
// export async function saveServerCart(userId: string, items: CartItem[]): Promise<void> { ... }
// export async function mergeCartsOnLogin(userId: string, localItems: CartItem[]): Promise<CartItem[]> { ... }
