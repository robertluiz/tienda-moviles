import { useEffect, useState } from 'react';
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
  const { products, isLoading, error, refetch } = useProductList(searchTerm);

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
          ) : isLoading ? (
            <ProductListSkeleton />
          ) : products.length > 0 ? (
            <div className="product-grid">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
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