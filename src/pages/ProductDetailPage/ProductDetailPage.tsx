import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useProductDetails from '../../hooks/useProductDetails';
import useCart from '../../hooks/useCart';
import Header from '../../components/Header/Header';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { product, isLoading, error, refetch } = useProductDetails(id || '');
    const { addProductToCart, isLoading: isAddingToCart } = useCart();

    const [selectedColor, setSelectedColor] = useState<number | null>(null);
    const [selectedStorage, setSelectedStorage] = useState<number | null>(null);

    if (isLoading) {
        return (
            <div className="product-detail-container">
                <Header />
                <div className="product-detail-content">
                    <div className="container">
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Carregando detalhes do produto...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-container">
                <Header />
                <div className="product-detail-content">
                    <div className="container">
                        <div className="error-container">
                            <p className="error-message">Ocorreu um erro ao carregar os detalhes do produto.</p>
                            <button className="reload-button" onClick={() => refetch()}>
                                Tentar novamente
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleColorSelect = (colorCode: number) => {
        setSelectedColor(colorCode);
    };

    const handleStorageSelect = (storageCode: number) => {
        setSelectedStorage(storageCode);
    };

    const handleAddToCart = () => {
        if (selectedColor !== null && selectedStorage !== null && product) {
            addProductToCart({
                id: product.id,
                colorCode: selectedColor,
                storageCode: selectedStorage
            });
        }
    };

    const canAddToCart = selectedColor !== null && selectedStorage !== null;

    return (
        <div className="product-detail-container">
            <Header />
            <div className="product-detail-content">
                <div className="container">
                    <div className="product-detail-header">
                        <div className="product-breadcrumb">
                            <Link to="/">Produtos</Link>
                            <span>/</span>
                            <span>{product.brand}</span>
                            <span>/</span>
                            <span>{product.model}</span>
                        </div>
                    </div>

                    <div className="product-detail-main">
                        <div className="product-image-section">
                            <img
                                src={product.imgUrl}
                                alt={`${product.brand} ${product.model}`}
                                className="product-image-main"
                            />
                        </div>

                        <div className="product-info-container">
                            <h1 className="product-title">{product.model}</h1>
                            <h2 className="product-brand">{product.brand}</h2>
                            <div className="product-price">{product.price}€</div>

                            <div className="product-options-container">
                                <div className="color-options">
                                    <h3 className="option-title">Cor</h3>
                                    <div className="option-list">
                                        {product.options.colors.map((color) => (
                                            <button
                                                key={color.code}
                                                className={`option-button ${selectedColor === color.code ? 'selected' : ''}`}
                                                onClick={() => handleColorSelect(color.code)}
                                            >
                                                {color.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="storage-options">
                                    <h3 className="option-title">Armazenamento</h3>
                                    <div className="option-list">
                                        {product.options.storages.map((storage) => (
                                            <button
                                                key={storage.code}
                                                className={`option-button ${selectedStorage === storage.code ? 'selected' : ''}`}
                                                onClick={() => handleStorageSelect(storage.code)}
                                            >
                                                {storage.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                className="add-to-cart-button"
                                disabled={!canAddToCart || isAddingToCart}
                                onClick={handleAddToCart}
                            >
                                {isAddingToCart ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage; 