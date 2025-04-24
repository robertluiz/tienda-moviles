import { useQuery } from '@tanstack/react-query';
import { fetchProductDetails, Product } from '../services/api';

export const useProductDetails = (productId: string) => {
  const { 
    data: product, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductDetails(productId),
    staleTime: 60 * 60 * 1000, 
    gcTime: 60 * 60 * 1000,
    enabled: !!productId,
    retry: 3,
    retryDelay: 1000
  });

  return {
    product,
    isLoading,
    error,
    refetch
  };
};

export default useProductDetails; 