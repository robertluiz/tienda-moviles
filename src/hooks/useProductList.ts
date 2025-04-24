import { useQuery } from '@tanstack/react-query';
import { fetchProducts, Product } from '../services/api';
import { useState, useCallback, useEffect, useRef } from 'react';

export const useProductList = (searchTerm: string = '') => {
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
      setHasMore(nextPageItems.length < filteredProducts.length);
      setIsLoadingMore(false);
      
      console.log(`Atualizando produtos: mostrando ${nextPageItems.length} de ${filteredProducts.length}`);
      console.log(`Página ${currentPage}, itemsPerPage ${itemsPerPage}, endIndex ${endIndex}`);
    }
  }, [filteredProducts, currentPage, itemsPerPage]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && !isLoadingMore) {
      console.log(`Carregando mais produtos... Página atual: ${currentPage}`);
      setIsLoadingMore(true);
      
      setTimeout(() => {
        setCurrentPage(prevPage => {
          console.log(`Incrementando página: ${prevPage} -> ${prevPage + 1}`);
          return prevPage + 1;
        });
      }, 200);
    }
  }, [isLoading, hasMore, isLoadingMore, currentPage]);

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