import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../services/api';

export const useProductList = (searchTerm: string = '') => {
  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 60 * 60 * 1000, // 1 hora (anteriormente cacheTime)
  });

  const filteredProducts = searchTerm 
    ? products.filter((product: Product) => 
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.model.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  return {
    products: filteredProducts,
    isLoading,
    error,
    refetch
  };
};

export default useProductList; 