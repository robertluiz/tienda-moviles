import './ProductListSkeleton.css';

export const ProductListSkeleton = () => {

    const skeletons = Array.from({ length: 8 }, (_, index) => index + 1);

    return (
        <div className="skeleton-grid">
            {skeletons.map((id) => (
                <div key={id} className="skeleton-card">
                    <div className="skeleton-image"></div>
                    <div className="skeleton-content">
                        <div className="skeleton-title"></div>
                        <div className="skeleton-subtitle"></div>
                        <div className="skeleton-price"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductListSkeleton; 