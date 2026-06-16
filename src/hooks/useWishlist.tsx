import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useAuthContext } from "@/hooks/useAuth";
import * as wishlistService from "@/services/wishlist.service";

type WishlistContextValue = {
  /** Set of funko IDs currently in the wishlist. */
  wishlist: Set<number>;
  /** True while the initial wishlist is being loaded. */
  loading: boolean;
  /** Add a funko to the wishlist. No-op if already present. */
  addToWishlist: (funkoId: number) => Promise<void>;
  /** Remove a funko from the wishlist. No-op if not present. */
  removeFromWishlist: (funkoId: number) => Promise<void>;
  /** Toggle a funko in/out of the wishlist. */
  toggleWishlist: (funkoId: number) => Promise<void>;
  /** Check if a funko is in the wishlist. */
  isInWishlist: (funkoId: number) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  // Load wishlist when user changes (login/logout)
  useEffect(() => {
    if (!user) {
      setWishlist(new Set());
      return;
    }

    let active = true;
    setLoading(true);

    wishlistService
      .fetchWishlist(user.id)
      .then((ids) => {
        if (active) setWishlist(new Set(ids));
      })
      .catch(() => {
        // Silently fail — wishlist is non-critical
        if (active) setWishlist(new Set());
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const addToWishlist = useCallback(
    async (funkoId: number) => {
      if (!user) return;
      // Optimistic update
      setWishlist((prev) => new Set(prev).add(funkoId));
      try {
        await wishlistService.addToWishlist(user.id, funkoId);
      } catch {
        // Rollback on failure
        setWishlist((prev) => {
          const next = new Set(prev);
          next.delete(funkoId);
          return next;
        });
        throw new Error("No se pudo agregar a la wishlist");
      }
    },
    [user],
  );

  const removeFromWishlist = useCallback(
    async (funkoId: number) => {
      if (!user) return;
      // Optimistic update
      setWishlist((prev) => {
        const next = new Set(prev);
        next.delete(funkoId);
        return next;
      });
      try {
        await wishlistService.removeFromWishlist(user.id, funkoId);
      } catch {
        // Rollback on failure
        setWishlist((prev) => new Set(prev).add(funkoId));
        throw new Error("No se pudo eliminar de la wishlist");
      }
    },
    [user],
  );

  const toggleWishlist = useCallback(
    async (funkoId: number) => {
      if (wishlist.has(funkoId)) {
        await removeFromWishlist(funkoId);
      } else {
        await addToWishlist(funkoId);
      }
    },
    [wishlist, addToWishlist, removeFromWishlist],
  );

  const isInWishlist = useCallback(
    (funkoId: number) => wishlist.has(funkoId),
    [wishlist],
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlistContext must be used within WishlistProvider");
  }
  return context;
}
