import { useEffect, useRef, useState, useCallback } from 'react';
import ProductCard from '../../components/ProductCard/ProductCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Layout from '../../components/Layout/Layout';
import useProductList from '../../hooks/useProductList';
import ProductListSkeleton from '../../components/ProductListSkeleton/ProductListSkeleton';
import './ProductListPage.css';
import { Product } from '../../services/api';

const ProductListPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [title, setTitle] = useState<string>('Todos los Productos');
  const loaderRef = useRef<HTMLDivElement>(null);

  const {
    products,
    filteredTotal,
    isLoading,
    isLoadingMore,
    error,
    refetch,
    loadMore,
    hasMore,
    currentPage
  } = useProductList(searchTerm);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;

    if (entry && entry.isIntersecting && hasMore && !isLoading && !isLoadingMore) {
      loadMore();
    }
  }, [hasMore, isLoading, isLoadingMore, loadMore]);

  useEffect(() => {

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    });

    const currentRef = loaderRef.current;

    if (currentRef && hasMore) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [handleObserver, hasMore]);

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

  const renderErrorOrEmpty = () => {
    if (error) {
      return (
        <div className="error-container">
          <p className="error-message">Se ha producido un error al cargar los productos.</p>
          <button className="reload-button" onClick={() => refetch()}>
            Intentar de nuevo
          </button>
        </div>
      );
    }

    if (!isLoading && products.length === 0) {
      return (
        <div className="error-container">
          <p>No se han encontrado productos.</p>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      {isLoading && products.length === 0 ? (
        <ProductListSkeleton />
      ) : (
        <>
          {renderErrorOrEmpty()}

          {products.length > 0 && (
            <>
              <div className="product-grid">
                {products.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isNew={product.id === '1'}
                  />
                ))}
              </div>

              <div className="load-more-section">
                {isLoadingMore && (
                  <div className="loading-more-indicator">
                    <div className="loading-spinner"></div>
                    <span>Cargando más productos...</span>
                  </div>
                )}

                {hasMore && !isLoadingMore && (
                  <div className="load-more-container">
                    <button
                      className="load-more-button"
                      onClick={loadMore}
                      disabled={isLoading || isLoadingMore}
                    >
                      Cargar más productos
                    </button>
                  </div>
                )}

                <span className="products-counter">
                  Mostrando {products.length} de {filteredTotal} productos (Página {currentPage})
                </span>

                <div
                  ref={loaderRef}
                  className="product-list-observer"
                  style={{ height: '100px', margin: '20px 0' }}
                />
              </div>
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export default ProductListPage; 