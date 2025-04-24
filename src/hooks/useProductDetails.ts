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
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 60 * 60 * 1000, // 1 hora (anteriormente cacheTime)
    enabled: !!productId
  });

  return {
    product,
    isLoading,
    error,
    refetch
  };
};

export default useProductDetails; 