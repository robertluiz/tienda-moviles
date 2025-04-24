import './ProductLoadingCard.css';

const ProductLoadingCard = () => {
    return (
        <div className="product-loading-card">
            <div className="loading-image-container">
                <div className="loading-image"></div>
            </div>
            <div className="loading-content">
                <div className="loading-brand"></div>
                <div className="loading-model"></div>
                <div className="loading-price"></div>
            </div>
        </div>
    );
};

export default ProductLoadingCard; 