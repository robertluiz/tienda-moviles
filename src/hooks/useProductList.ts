import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../services/api';
import { useState, useCallback, useEffect, useRef } from 'react';

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
    staleTime: 60 * 60 * 1000, // 1 hora
    gcTime: 60 * 60 * 1000, // 1 hora (anteriormente cacheTime)
  });

  const filteredProducts = searchTerm 
    ? products.filter((product: Product) => 
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.model.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  // Reset quando o termo de busca muda
  useEffect(() => {
    setDisplayedProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setIsLoadingMore(false);
    initialLoadComplete.current = false;
  }, [searchTerm]);

  // Atualiza os produtos exibidos quando a página muda ou os produtos filtrados mudam
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
      
      // Calcular a próxima página e verificar se há mais produtos
      const nextPage = currentPage + 1;
      const nextEndIndex = nextPage * itemsPerPage;
      
      // Simular delay de rede para mostrar o efeito de carregamento
      setTimeout(() => {
        setCurrentPage(nextPage);
        
        // Atualizar estado de hasMore após o incremento da página
        if (nextEndIndex >= filteredProducts.length) {
          setHasMore(false);
        }
      }, 800);
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