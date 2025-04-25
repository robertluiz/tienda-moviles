import { Product } from '../../services/api';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
}

const ProductList = ({ products, isLoading }: ProductListProps) => {
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-products">
        <p>No se encontraron productos con los criterios de búsqueda.</p>
        <p>Intente con otra búsqueda o vea todos los productos.</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-count">
        <p>{products.length} productos encontrados</p>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList; 