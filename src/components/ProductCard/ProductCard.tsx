import { Link } from 'react-router-dom';
import { Product } from '../../services/api';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { id, brand, model, price, imgUrl } = product;

  return (
    <div className="product-card">
      <Link to={`/product/${id}`} className="product-link">
        <div className="product-image-container">
          <img src={imgUrl} alt={`${brand} ${model}`} className="product-image" />
        </div>
        
        <div className="product-info">
          <h3 className="product-brand">{brand}</h3>
          <h4 className="product-model">{model}</h4>
          <div className="product-price-container">
            <span className="product-price">{price}€</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 