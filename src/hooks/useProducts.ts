import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../services/api';

export const useProducts = (searchTerm: string = '') => {
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
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
  };
};

export default useProducts; 