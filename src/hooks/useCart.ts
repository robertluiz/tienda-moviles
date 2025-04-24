import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart, AddToCartRequest } from '../services/api';
import useCartStore from '../store/cartStore';
import { useEffect } from 'react';

export const useCart = () => {
  const queryClient = useQueryClient();
  const { cartCount, setCartCount, lastAddedProduct } = useCartStore();

  // Restaurar el contador del carrito desde localStorage en la inicialización
  useEffect(() => {
    const storedCart = localStorage.getItem('cart-storage');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        if (parsedCart.state && typeof parsedCart.state.cartCount === 'number') {
          setCartCount(parsedCart.state.cartCount);
        }
      } catch (error) {
        console.error('Error al restaurar el carrito desde localStorage:', error);
      }
    }
  }, [setCartCount]);

  const mutation = useMutation({
    mutationFn: (request: AddToCartRequest) => addToCart(request),
    onSuccess: (data) => {
      setCartCount(data.count);
      
      // Actualizar el localStorage manualmente para garantizar la persistencia
      const storedCart = localStorage.getItem('cart-storage');
      if (storedCart) {
        try {
          const parsedCart = JSON.parse(storedCart);
          parsedCart.state.cartCount = data.count;
          localStorage.setItem('cart-storage', JSON.stringify(parsedCart));
        } catch (error) {
          console.error('Error al actualizar el carrito en localStorage:', error);
        }
      }
    },
    onError: (error) => {
      console.error('Error al añadir al carrito:', error);
      throw error;
    }
  });

  const addProductToCart = (request: AddToCartRequest) => {
    mutation.mutate(request);
  };

  return {
    cartCount,
    lastAddedProduct,
    addProductToCart,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export default useCart; 