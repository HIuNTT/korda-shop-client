import { CartPrices, CartProduct } from "@/types/cart"
import { create } from "zustand"

interface CartItem extends CartProduct {}

interface Cart {
  products: CartItem[]
}

interface CartState {
  cart: Cart
  prices: CartPrices
  selectedIds: Set<string>

  setPrices: (prices: CartPrices) => void
  clearPrices: () => void
  setCart: (cart: Cart) => void
  updateCart: (products: CartItem[]) => void
  clear: () => void
  toggleSelection: (itemId: string, value: boolean) => void
  toggleAllSelection: (value: boolean) => void
  setSelected: (ids: string[]) => void
}

const initialCartState: Pick<CartState, "cart" | "prices" | "selectedIds"> = {
  cart: {
    products: [],
  },
  prices: {
    total: 0,
    total_discount: 0,
    total_voucher_price: 0,
    estimated_price: 0,
  },
  selectedIds: new Set<string>(),
}

export const useCart = create<CartState>()((set, get) => ({
  ...initialCartState,
  setCart: (cart) => set({ cart: { ...get().cart, ...cart } }),
  updateCart: (products) =>
    set((state) => {
      const newProducts = new Map<string, CartItem>(products.map((item) => [item.id, item]))
      const nextProducts: CartItem[] = []
      state.cart.products.forEach((item) => {
        if (newProducts.has(item.id)) {
          nextProducts.push(newProducts.get(item.id)!)
          newProducts.delete(item.id)
        }
      })
      return {
        cart: {
          products: nextProducts,
        },
      }
    }),
  setPrices: (prices) => set({ prices }),
  clearPrices: () =>
    set({
      prices: {
        total: 0,
        total_discount: 0,
        total_voucher_price: 0,
        estimated_price: 0,
      },
    }),
  clear: () => set({ ...initialCartState }),
  toggleAllSelection: (value) =>
    set({ selectedIds: value ? new Set(get().cart.products.map((item) => item.id)) : new Set() }),
  toggleSelection: (itemId, value) =>
    set((state) => {
      const selectedIds = new Set(state.selectedIds)
      if (value) {
        selectedIds.add(itemId)
      } else {
        selectedIds.delete(itemId)
      }
      return { selectedIds }
    }),
  setSelected: (ids) => set({ selectedIds: new Set(ids) }),
}))
