import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addToCart, AddToCartRequest } from '../services/api';
import useCartStore from '../store/cartStore';

export const useCart = () => {
  const queryClient = useQueryClient();
  const setCartCount = useCartStore(state => state.setCartCount);

  const mutation = useMutation({
    mutationFn: (request: AddToCartRequest) => addToCart(request),
    onSuccess: (data) => {
      setCartCount(data.count);
    },
  });

  const addProductToCart = (request: AddToCartRequest) => {
    mutation.mutate(request);
  };

  return {
    addProductToCart,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};

export default useCart; 