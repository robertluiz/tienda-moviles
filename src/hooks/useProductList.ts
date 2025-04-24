import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../services/api';
import { useState, useCallback, useEffect } from 'react';

export const useProductList = (searchTerm: string = '') => {
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const itemsPerPage = 6;

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

  useEffect(() => {
    setDisplayedProducts([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [searchTerm]);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      const nextItems = filteredProducts.slice(0, currentPage * itemsPerPage);
      setDisplayedProducts(nextItems);
      setHasMore(nextItems.length < filteredProducts.length);
      setIsLoadingMore(false);
    }
  }, [filteredProducts, currentPage]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      
      // Pequeno atraso para permitir a transição suave
      setTimeout(() => {
        setCurrentPage(prevPage => prevPage + 1);
      }, 300);
    }
  }, [isLoading, hasMore, isLoadingMore]);

  return {
    products: displayedProducts,
    filteredTotal: filteredProducts.length,
    isLoading,
    isLoadingMore,
    error,
    refetch,
    loadMore,
    hasMore
  };
};

export default useProductList; 