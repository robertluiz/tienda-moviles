import { Link } from 'react-router-dom';
import { Product } from '../../services/api';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
  isDiscount?: boolean;
  discountPercentage?: number;
  rating?: number;
}

const ProductCard = ({
  product,
  isNew = false,
  isDiscount = false,
  discountPercentage = 0,
  rating = 0
}: ProductCardProps) => {
  const { id, brand, model, price, imgUrl } = product;

  // Verificar se o produto tem um preço válido
  const hasValidPrice = (): boolean => {
    return Boolean(price) && !isNaN(parseFloat(price)) && parseFloat(price) > 0;
  };

  const renderBadges = () => {
    if (!isNew && !isDiscount) return null;

    return (
      <div className="product-badges">
        {isNew && <span className="product-badge product-badge-new">Novo</span>}
        {isDiscount && (
          <span className="product-badge product-badge-discount">-{discountPercentage}%</span>
        )}
      </div>
    );
  };

  const renderRating = () => {
    if (!rating) return null;

    return (
      <div className="product-rating">
        <div className="stars-container">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${star <= rating ? 'filled' : 'empty'}`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="rating-value">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Verificar se o preço é válido
  const priceIsValid = hasValidPrice();

  return (
    <div className="product-card">
      <Link to={`/product/${id}`} className="product-link">
        <div className="product-image-container">
          {renderBadges()}
          <img src={imgUrl} alt={`${brand} ${model}`} className="product-image" />
        </div>

        <div className="product-info">
          <h3 className="product-brand">{brand}</h3>
          <h4 className="product-model">{model}</h4>
          {renderRating()}
          <div className="product-price-container">
            {priceIsValid ? (
              <span className="product-price">{price}€</span>
            ) : (
              <span className="product-price-unavailable">Precio no disponible</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 