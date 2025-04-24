import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AddToCartRequest, addToCart } from '../services/api';

interface CartState {
  cartCount: number;
  addProductToCart: (request: AddToCartRequest) => Promise<void>;
  setCartCount: (count: number) => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartCount: 0,
      
      addProductToCart: async (request: AddToCartRequest) => {
        try {
          const response = await addToCart(request);
          set({ cartCount: response.count });
        } catch (error) {
          console.error('Error adding product to cart:', error);
        }
      },
      
      setCartCount: (count: number) => {
        set({ cartCount: count });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cartCount: state.cartCount }),
    }
  )
);

export default useCartStore; 