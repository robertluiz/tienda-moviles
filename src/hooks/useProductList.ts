import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../services/api';
import { useState, useCallback, useEffect, useMemo } from 'react';

const LOAD_MORE_DELAY = process.env.NODE_ENV === 'test' ? 0 : 800;

interface UseProductListReturn {
  products: Product[];
  filteredTotal: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: Error | null;
  refetch: () => void;
  loadMore: () => void;
  hasMore: boolean;
  currentPage: number;
  itemsPerPage: number;
}

export const useProductList = (searchTerm: string = ''): UseProductListReturn => {

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const itemsPerPage = 6;
  
  const { data: allProducts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 60 * 60 * 1000, 
    gcTime: 60 * 60 * 1000, 
  });

  const filteredProducts = useMemo(() => {
    return searchTerm 
      ? allProducts.filter((product: Product) => 
          product.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
          product.model.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allProducts;
  }, [allProducts, searchTerm]);

  const displayedProducts = useMemo(() => {
    const endIndex = currentPage * itemsPerPage;
    return filteredProducts.slice(0, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const hasMore = useMemo(() => {
    return displayedProducts.length < filteredProducts.length;
  }, [displayedProducts.length, filteredProducts.length]);

  useEffect(() => {
    setCurrentPage(1);
    setIsLoadingMore(false);
  }, [searchTerm]);

  const loadMore = useCallback(() => {
   
    if (!isLoading && hasMore && !isLoadingMore) { 
      setIsLoadingMore(true);
      
      const nextPage = currentPage + 1;
      
      if (LOAD_MORE_DELAY > 0) {
        setTimeout(() => {
          setCurrentPage(nextPage);
          setIsLoadingMore(false); 
        }, LOAD_MORE_DELAY);
      } else {
        setCurrentPage(nextPage);
        setIsLoadingMore(false);
      }
    }
  }, [isLoading, hasMore, isLoadingMore, currentPage, itemsPerPage]); 

  return {
    products: displayedProducts,
    filteredTotal: filteredProducts.length,
    isLoading,
    isLoadingMore,
    error,
    refetch,
    loadMore,
    hasMore,
    currentPage,
    itemsPerPage
  };
};

export default useProductList; 