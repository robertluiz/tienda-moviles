import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddToCartRequest, AddToCartResponse, addToCart } from '../services/api';
import useCartStore from '../store/cartStore';

export const useCart = () => {
  const queryClient = useQueryClient();
  const { setCartCount } = useCartStore();

  const mutation = useMutation({
    mutationFn: (request: AddToCartRequest) => addToCart(request),
    onSuccess: (data: AddToCartResponse) => {
      // Atualiza o contador do carrinho no store
      setCartCount(data.count);
      
      // Invalidar o cache de produtos se necessário
      // queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: Error) => {
      console.error('Error adding to cart:', error);
    },
  });

  return {
    addToCart: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
};

export default useCart; 