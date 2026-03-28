import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: string | number;
  product_name: string;
  price: number;
  image_url: string | null;
  size?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: string | number, quantity: number, size?: string) => void;
  removeItem: (id: string | number, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  // Get current storage key based on user
  const getStorageKey = () => user ? `hnamstore-cart-${user.id}` : null;

  // Load items when user changes
  useEffect(() => {
    const key = getStorageKey();
    if (key) {
      const saved = localStorage.getItem(key);
      setItems(saved ? JSON.parse(saved) : []);
    } else {
      setItems([]);
    }
  }, [user]);

  // Save items when items change
  useEffect(() => {
    const key = getStorageKey();
    if (key) {
      localStorage.setItem(key, JSON.stringify(items));
    }
  }, [items, user]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    if (!user) return; // Don't allow adding to cart if not logged in
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          (i.id === item.id && i.size === item.size) ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const updateQuantity = (id: string | number, quantity: number, size?: string) => {
    if (!user) return;
    if (quantity < 1) return removeItem(id, size);
    setItems((prev) => prev.map((i) => (i.id === id && i.size === size ? { ...i, quantity } : i)));
  };

  const removeItem = (id: string | number, size?: string) => {
    if (!user) return;
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
