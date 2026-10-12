"use client";
import { useSyncExternalStore } from "react";
import { products } from "./catalog";
import { addLine, lineKey, sanitizeCart, type CartLine } from "./commerce";
type ShopState = {
  cart: CartLine[];
  wishlist: string[];
  ready: boolean;
  notice: string;
  storageError: boolean;
};
const empty: ShopState = {
  cart: [],
  wishlist: [],
  ready: false,
  notice: "",
  storageError: false,
};
let state = empty;
let initialized = false;
const listeners = new Set<() => void>();
const key = "forme.shop.v1";
function emit() {
  listeners.forEach((l) => l());
}
function hydrate() {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "{}");
    state = {
      cart: sanitizeCart(raw.cart, products),
      wishlist: Array.isArray(raw.wishlist)
        ? [
            ...new Set<string>(
              raw.wishlist.filter(
                (id: unknown) =>
                  typeof id === "string" && products.some((p) => p.id === id),
              ),
            ),
          ]
        : [],
      ready: true,
      notice: "",
      storageError: false,
    };
  } catch {
    state = { ...empty, ready: true, storageError: true };
  }
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!initialized) {
    initialized = true;
    hydrate();
  }
  const storage = (event: StorageEvent) => {
    if (event.key === key) {
      hydrate();
      emit();
    }
  };
  window.addEventListener("storage", storage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", storage);
  };
}
function save(next: ShopState) {
  state = next;
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ cart: state.cart, wishlist: state.wishlist }),
    );
  } catch {
    state = { ...state, storageError: true };
  }
  emit();
}
export function useShop() {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => empty,
  );
}
export function addToCart(line: CartLine) {
  save({
    ...state,
    cart: addLine(state.cart, line, products),
    notice: "Added to your bag.",
  });
}
export function updateQuantity(line: CartLine, quantity: number) {
  save({
    ...state,
    cart: sanitizeCart(
      state.cart.map((l) =>
        lineKey(l) === lineKey(line) ? { ...l, quantity } : l,
      ),
      products,
    ),
    notice: quantity === 0 ? "Removed from your bag." : "Bag updated.",
  });
}
export function toggleWishlist(id: string) {
  save({
    ...state,
    wishlist: state.wishlist.includes(id)
      ? state.wishlist.filter((x) => x !== id)
      : [...state.wishlist, id],
    notice: state.wishlist.includes(id)
      ? "Removed from your wishlist."
      : "Saved to your wishlist.",
  });
}
export function clearCart() {
  save({ ...state, cart: [], notice: "Your demo order is complete." });
}
