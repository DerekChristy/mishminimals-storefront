import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface GiftBoxItem {
  id: string
  variant_id: string
  title: string
  thumbnail?: string | null
}

interface GiftBoxState {
  items: GiftBoxItem[]
  addItem: (item: GiftBoxItem) => void
  removeItem: (id: string) => void
  clearBox: () => void
  isBoxFull: boolean
  remainingItems: number
}

export const useGiftBoxStore = create<GiftBoxState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const { items } = get()
        // Limit to 6 items per box for luxury exclusivity
        if (items.length < 6 && !items.some((i) => i.id === item.id)) {
          set({ items: [...items, item] })
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      clearBox: () => set({ items: [] }),

      // Derived State
      get isBoxFull() {
        return get().items.length >= 3
      },

      get remainingItems() {
        const count = 3 - get().items.length
        return count > 0 ? count : 0
      },
    }),
    {
      name: "mishminimals-gift-box", // Key for localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
)
