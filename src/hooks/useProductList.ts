import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../services/api';
import { useState, useCallback, useEffect, useRef } from 'react';

// Constante para determinar el tiempo de carga (0 en entorno de test)
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
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const itemsPerPage = 6;
  const initialLoadComplete = useRef(false);

  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 60 * 60 * 1000, 
    gcTime: 60 * 60 * 1000, 
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
    setIsLoadingMore(false);
    initialLoadComplete.current = false;
  }, [searchTerm]);

  useEffect(() => {
    if (filteredProducts.length > 0) {
      const endIndex = currentPage * itemsPerPage;
      const nextPageItems = filteredProducts.slice(0, endIndex);
      
      setDisplayedProducts(nextPageItems);
      setHasMore(endIndex < filteredProducts.length);
      setIsLoadingMore(false);
    } else {
      setDisplayedProducts([]);
      setHasMore(false);
      setIsLoadingMore(false);
    }
  }, [filteredProducts, currentPage, itemsPerPage]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      
      const nextPage = currentPage + 1;
      const nextEndIndex = nextPage * itemsPerPage;
      
      // En entorno de test (LOAD_MORE_DELAY = 0), se ejecuta inmediatamente
      if (LOAD_MORE_DELAY === 0) {
        setCurrentPage(nextPage);
        if (nextEndIndex >= filteredProducts.length) {
          setHasMore(false);
        }
        setIsLoadingMore(false);
      } else {
        setTimeout(() => {
          setCurrentPage(nextPage);
          
          if (nextEndIndex >= filteredProducts.length) {
            setHasMore(false);
          }
          setIsLoadingMore(false);
        }, LOAD_MORE_DELAY);
      }
    }
  }, [isLoading, hasMore, isLoadingMore, currentPage, filteredProducts.length, itemsPerPage]);

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