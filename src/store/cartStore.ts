import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AddToCartRequest, addToCart } from '../services/api';

interface CartState {
  cartCount: number;
  lastAddedProduct: AddToCartRequest | null;
  addProductToCart: (request: AddToCartRequest) => Promise<void>;
  setCartCount: (count: number) => void;
  clearLastAddedProduct: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartCount: 0,
      lastAddedProduct: null,
      
      addProductToCart: async (request: AddToCartRequest) => {
        try {
          const response = await addToCart(request);
          set({ 
            cartCount: response.count,
            lastAddedProduct: request
          });
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
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        cartCount: state.cartCount,
        lastAddedProduct: state.lastAddedProduct
      }),
    }
  )
);

export default useCartStore; 