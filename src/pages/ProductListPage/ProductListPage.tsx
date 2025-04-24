import { useEffect, useState, useRef, useCallback } from 'react';
import useProductList from '../../hooks/useProductList';
import ProductCard from '../../components/ProductCard/ProductCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Header from '../../components/Header/Header';
import ProductListSkeleton from '../../components/ProductListSkeleton/ProductListSkeleton';
import { Product } from '../../services/api';
import './ProductListPage.css';

const ProductListPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [title, setTitle] = useState<string>('Todos los Productos');
  const [animationKey, setAnimationKey] = useState<number>(0);
  const {
    products,
    filteredTotal,
    isLoading,
    isLoadingMore,
    error,
    refetch,
    loadMore,
    hasMore
  } = useProductList(searchTerm);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
      loadMore();
      setAnimationKey(prev => prev + 1);
    }
  }, [hasMore, isLoading, isLoadingMore, loadMore]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    };

    observerRef.current = new IntersectionObserver(handleObserver, options);

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  useEffect(() => {
    if (searchTerm) {
      setTitle(`Resultados para: ${searchTerm}`);
      setAnimationKey(prev => prev + 1);
    } else {
      setTitle('Todos los Productos');
    }
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleLoadMore = () => {
    loadMore();
    setAnimationKey(prev => prev + 1);
  };

  return (
    <div className="page-container">
      <Header />
      <div className="main-content">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">{title}</h1>
            <SearchBar onSearch={handleSearch} />
          </div>

          {error ? (
            <div className="error-container">
              <p className="error-message">Se ha producido un error al cargar los productos.</p>
              <button className="reload-button" onClick={() => refetch()}>
                Intentar de nuevo
              </button>
            </div>
          ) : isLoading && products.length === 0 ? (
            <ProductListSkeleton />
          ) : products.length > 0 ? (
            <>
              <div className="product-grid" key={`product-grid-${animationKey}`}>
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="load-more-section">
                {hasMore && (
                  <div className="load-more-container">
                    <button
                      className="load-more-button"
                      onClick={handleLoadMore}
                      disabled={isLoading || isLoadingMore}
                    >
                      {isLoadingMore ? (
                        <>
                          <span className="button-loading-spinner"></span>
                          <span>Cargando...</span>
                        </>
                      ) : (
                        'Cargar más productos'
                      )}
                    </button>
                  </div>
                )}

                <span className="products-counter">
                  Mostrando {products.length} de {filteredTotal} productos
                </span>

                {isLoadingMore && (
                  <div className="loading-more-indicator">
                    <div className="loading-spinner"></div>
                    <span>Cargando más productos...</span>
                  </div>
                )}

                <div ref={loadMoreRef} className="product-list-observer"></div>
              </div>
            </>
          ) : (
            <div className="error-container">
              <p>No se han encontrado productos.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage; 