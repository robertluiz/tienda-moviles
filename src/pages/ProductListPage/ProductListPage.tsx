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
  const {
    products,
    filteredTotal,
    isLoading,
    error,
    refetch,
    loadMore,
    hasMore
  } = useProductList(searchTerm);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting && hasMore && !isLoading) {
      loadMore();
    }
  }, [hasMore, isLoading, loadMore]);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0
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
    } else {
      setTitle('Todos los Productos');
    }
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleLoadMore = () => {
    loadMore();
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
              <div className="product-grid">
                {products.map((product: Product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {hasMore && (
                <div className="load-more-container">
                  <button
                    className="load-more-button"
                    onClick={handleLoadMore}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cargando...' : 'Cargar más productos'}
                  </button>
                </div>
              )}

              <span className="products-counter">
                Mostrando {products.length} de {filteredTotal} productos
              </span>

              <div ref={loadMoreRef} className="product-list-observer"></div>
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