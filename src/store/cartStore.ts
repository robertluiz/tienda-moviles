import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, AddToCartRequest } from '../services/api';
import api from '../services/api';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  colorCode: number;
  storageCode: number;
}

interface ExtendedAddToCartRequest extends AddToCartRequest {
  quantity?: number;
}

interface CartResponse {
  count: number;
}

export interface CartState {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: Product, colorCode: number, storageCode: number, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  addProductToCart: (request: ExtendedAddToCartRequest, productData?: Product) => Promise<CartResponse>;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      cartCount: 0,

      addToCart: (product: Product, colorCode: number, storageCode: number, quantity = 1) => {
        const { cartItems } = get();
        const cartItemId = `${product.id}-${colorCode}-${storageCode}`;
        
        const existingItemIndex = cartItems.findIndex(item => item.id === cartItemId);
        
        if (existingItemIndex !== -1) {
          const updatedItems = [...cartItems];
          updatedItems[existingItemIndex].quantity = quantity;
          
          const newCartCount = updatedItems.reduce((total, item) => total + item.quantity, 0);
          
          set({
            cartItems: updatedItems,
            cartCount: newCartCount
          });
        } else {
          const newItem: CartItem = {
            id: cartItemId,
            product,
            quantity,
            colorCode,
            storageCode
          };
          
          const newCartCount = get().cartCount + quantity;
          
          set({
            cartItems: [...cartItems, newItem],
            cartCount: newCartCount
          });
        }
      },

      removeFromCart: (id: string) => {
        const { cartItems } = get();
        const itemToRemove = cartItems.find(item => item.id === id);
        
        if (!itemToRemove) return;
        
        set({
          cartItems: cartItems.filter(item => item.id !== id),
          cartCount: get().cartCount - itemToRemove.quantity
        });
      },

      updateQuantity: (id: string, quantity: number) => {
        const { cartItems } = get();
        const itemIndex = cartItems.findIndex(item => item.id === id);
        
        if (itemIndex === -1) return;
        
        const oldQuantity = cartItems[itemIndex].quantity;
        const updatedItems = [...cartItems];
        updatedItems[itemIndex].quantity = quantity;
        
        set({
          cartItems: updatedItems,
          cartCount: get().cartCount - oldQuantity + quantity
        });
      },

      clearCart: () => {
        set({
          cartItems: [],
          cartCount: 0
        });
      },

      addProductToCart: async (request: ExtendedAddToCartRequest, productData?: Product) => {
        try {
          const { quantity, ...apiRequest } = request;
          const userQuantity = quantity || 1;
          
          const response = await api.post('/cart', apiRequest);
          
          if (response.data) {
            if (productData) {
              const existingItemId = `${request.id}-${request.colorCode}-${request.storageCode}`;
              const existingItemIndex = get().cartItems.findIndex(item => item.id === existingItemId);
              
              if (existingItemIndex !== -1) {
                const updatedItems = [...get().cartItems];
                updatedItems[existingItemIndex].quantity = userQuantity;
                
                set({
                  cartItems: updatedItems,
                  cartCount: get().cartItems.reduce((total, item, index) => 
                    index === existingItemIndex ? total + userQuantity : total + item.quantity, 0)
                });
              } else {
                const newItem: CartItem = {
                  id: existingItemId,
                  product: productData,
                  quantity: userQuantity,
                  colorCode: request.colorCode,
                  storageCode: request.storageCode
                };
                
                set({
                  cartItems: [...get().cartItems, newItem],
                  cartCount: get().cartCount + userQuantity
                });
              }
            } else {
              try {
                const productResponse = await api.get(`/product/${request.id}`);
                const product = productResponse.data;
                
                get().addToCart(product, request.colorCode, request.storageCode, userQuantity);
              } catch (error) {
                console.error("Erro ao buscar detalhes do produto:", error);
                
                const tempProduct: Product = {
                  id: request.id,
                  brand: "Produto",
                  model: "Adicionado",
                  price: "170",
                  imgUrl: "",
                  options: {
                    colors: [],
                    storages: []
                  }
                };
                
                get().addToCart(tempProduct, request.colorCode, request.storageCode, userQuantity);
              }
            }
            
            return response.data;
          }
          
          return response.data;
        } catch (error) {
          console.error("Erro ao adicionar produto ao carrinho:", error);
          throw error;
        }
      }
    }),
    {
      name: 'cart-storage',
    }
  )
);

export default useCartStore; 