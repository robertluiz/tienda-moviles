import { useQuery } from '@tanstack/react-query';
import { fetchProductDetails } from '../services/api';

const useProductDetails = (productId: string) => {
  const { 
    data: product, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProductDetails(productId),
    staleTime: 1000 * 60 * 60, 
    retry: 1,
  });

  return {
    product,
    isLoading,
    isError,
    error,
    refetch
  };
};

export default useProductDetails; 