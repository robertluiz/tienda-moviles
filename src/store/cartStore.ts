import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AddToCartRequest, AddToCartResponse, addToCart } from '../services/api';

interface CartState {
  cartCount: number;
  lastAddedProduct: AddToCartRequest | null;
  addProductToCart: (request: AddToCartRequest) => Promise<AddToCartResponse>;
  setCartCount: (count: number) => void;
  clearLastAddedProduct: () => void;
  resetCart: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartCount: 0,
      lastAddedProduct: null,
      
      addProductToCart: async (request: AddToCartRequest) => {
        try {
          const response = await addToCart(request);
          set({ 
            cartCount: response.count,
            lastAddedProduct: request
          });
          return response;
        } catch (error) {
          console.error('Error al añadir producto al carrito:', error);
          throw error;
        }
      },
      
      setCartCount: (count: number) => {
        set({ cartCount: count });
      },

      clearLastAddedProduct: () => {
        set({ lastAddedProduct: null });
      },

      resetCart: () => {
        set({ cartCount: 0, lastAddedProduct: null });
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        cartCount: state.cartCount,
        lastAddedProduct: state.lastAddedProduct
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Estado del carrito restaurado desde localStorage:', state);
        }
      }
    }
  )
);

export default useCartStore; 