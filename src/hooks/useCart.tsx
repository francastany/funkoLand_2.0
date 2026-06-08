import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { CartItem } from "@/types";
import { loadCart, saveCart } from "@/services/cart.service";

type UseCartOptions = {
  storageKey?: string;
  initialItems?: CartItem[];
  taxRate?: number;
};

const DEFAULT_STORAGE_KEY = "funkoland_cart";
const DEFAULT_TAX_RATE = 0.1;

export function useCart(options: UseCartOptions = {}) {
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
  const initialItems = options.initialItems ?? [];
  const taxRate = options.taxRate ?? DEFAULT_TAX_RATE;

  const [items, setItems] = useState<CartItem[]>(() => {
    const stored = loadCart(storageKey);
    return stored.length > 0 ? stored : initialItems;
  });

  useEffect(() => {
    saveCart(items, storageKey);
  }, [items, storageKey]);

  const addItem = useCallback(
    (nextItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      setItems((prev) => {
        const quantity = nextItem.quantity ?? 1;
        const existing = prev.find((item) => item.id === nextItem.id);
        if (existing) {
          return prev.map((item) =>
            item.id === nextItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
        }
        return [...prev, { ...nextItem, quantity }];
      });
    },
    [],
  );

  const updateQuantity = useCallback((id: number, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((item) => item.id !== id);
      return prev.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      );
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (id: number) => items.some((item) => item.id === id),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const taxes = useMemo(() => subtotal * taxRate, [subtotal, taxRate]);

  const total = useMemo(() => subtotal + taxes, [subtotal, taxes]);

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    isInCart,
    subtotal,
    taxes,
    total,
    itemCount,
    cartQty: itemCount,
  };
}

type CartContextValue = ReturnType<typeof useCart>;

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
  children: ReactNode;
  storageKey?: string;
  initialItems?: CartItem[];
};

export function CartProvider({
  children,
  storageKey,
  initialItems,
}: CartProviderProps) {
  const value = useCart({ storageKey, initialItems });
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return context;
}
