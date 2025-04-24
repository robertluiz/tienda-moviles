import { useEffect, useState } from 'react';
import useProductList from '../../hooks/useProductList';
import ProductCard from '../../components/ProductCard/ProductCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Header from '../../components/Header/Header';
import { Product } from '../../services/api';
import './ProductListPage.css';

const ProductListPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [title, setTitle] = useState<string>('Todos os Produtos');
  const { products, isLoading, error, refetch } = useProductList(searchTerm);

  useEffect(() => {
    if (searchTerm) {
      setTitle(`Resultados para: ${searchTerm}`);
    } else {
      setTitle('Todos os Produtos');
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
              <p className="error-message">Ocorreu um erro ao carregar os produtos.</p>
              <button className="reload-button" onClick={() => refetch()}>
                Tentar novamente
              </button>
            </div>
          ) : isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Carregando produtos...</p>
            </div>
          ) : products.length > 0 ? (
            <div className="product-grid">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="error-container">
              <p>Nenhum produto encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage; 