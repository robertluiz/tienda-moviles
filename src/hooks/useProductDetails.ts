import { useQuery } from '@tanstack/react-query';
import { fetchProductDetails, Product } from '../services/api';

export const useProductDetails = (productId: string) => {
  return useQuery({
    queryKey: ['productDetails', productId],
    queryFn: () => fetchProductDetails(productId),
    enabled: !!productId,
    staleTime: 60 * 60 * 1000, // 1 hora
    cacheTime: 60 * 60 * 1000, // 1 hora
  });
};

export default useProductDetails; 