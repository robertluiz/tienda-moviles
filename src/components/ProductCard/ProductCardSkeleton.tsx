import './ProductCardSkeleton.css';

const ProductCardSkeleton = () => {
    return (
        <div className="product-card-skeleton">
            <div className="skeleton-image-container"></div>
            <div className="skeleton-info">
                <div className="skeleton-brand"></div>
                <div className="skeleton-model"></div>
                <div className="skeleton-rating"></div>
                <div className="skeleton-price"></div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton; 