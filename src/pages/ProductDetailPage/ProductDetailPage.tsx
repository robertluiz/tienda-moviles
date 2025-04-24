import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useProductDetails from '../../hooks/useProductDetails';
import useCart from '../../hooks/useCart';
import useNotifications from '../../hooks/useNotifications';
import Header from '../../components/Header/Header';
import NotificationContainer from '../../components/Notification/NotificationContainer';
import './ProductDetailPage.css';

// Definir a interface estendida localmente para lidar com propriedade quantity
interface ExtendedAddToCartRequest {
    id: string;
    colorCode: number;
    storageCode: number;
    quantity?: number;
}

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { product, isLoading, error, refetch } = useProductDetails(id || '');
    const { addProductToCart, isLoading: isAddingToCart, isSuccess, isError } = useCart();
    const { notifications, showSuccess, showError, removeNotification } = useNotifications();

    const [selectedColor, setSelectedColor] = useState<number | null>(null);
    const [selectedStorage, setSelectedStorage] = useState<number | null>(null);
    const [quantity, setQuantity] = useState<number>(1);

    // Seleciona automaticamente a primeira opção quando o produto carrega
    useEffect(() => {
        if (product && product.options) {
            if (product.options.colors && product.options.colors.length > 0) {
                setSelectedColor(product.options.colors[0].code);
            }
            if (product.options.storages && product.options.storages.length > 0) {
                setSelectedStorage(product.options.storages[0].code);
            }
        }
    }, [product]);

    const handleColorSelect = (colorCode: number) => {
        setSelectedColor(colorCode);
    };

    const handleStorageSelect = (storageCode: number) => {
        setSelectedStorage(storageCode);
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const increaseQuantity = () => {
        setQuantity(quantity + 1);
    };

    // Verificar se o produto tem um preço válido
    const hasValidPrice = (product: any): boolean => {
        return product &&
            product.price !== undefined &&
            product.price !== null &&
            !isNaN(Number(product.price)) &&
            Number(product.price) > 0;
    };

    const handleAddToCart = () => {
        if (!product) return;

        if (selectedColor === null || selectedStorage === null) {
            console.error('Opções não selecionadas');
            return;
        }

        if (product.price === null || product.price === "0") {
            console.error('Preço inválido para produto', product);
            return;
        }

        const request: ExtendedAddToCartRequest = {
            id: product.id,
            colorCode: Number(selectedColor),
            storageCode: Number(selectedStorage),
            quantity: quantity
        };

        addProductToCart(request, product);

        showSuccess(`${product.brand} ${product.model} añadido al carrito`);
    };

    if (isLoading) {
        return (
            <div className="product-detail-container">
                <Header />
                <div className="product-detail-content">
                    <div className="container">
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Cargando detalles del producto...</p>
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
                            <p className="error-message">Se ha producido un error al cargar los detalles del producto.</p>
                            <button className="reload-button" onClick={() => refetch()}>
                                Intentar de nuevo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Verificar se o produto tem preço
    const priceIsValid = hasValidPrice(product);

    return (
        <div className="product-detail-container">
            <Header />
            <NotificationContainer
                notifications={notifications}
                onRemove={removeNotification}
            />
            <div className="product-detail-content">
                <div className="container">
                    <div className="product-detail-header">
                        <div className="product-breadcrumb">
                            <Link to="/">Productos</Link>
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
                            {priceIsValid ? (
                                <div className="product-price">{product.price}€</div>
                            ) : (
                                <div className="product-price-unavailable">Precio no disponible</div>
                            )}

                            <div className="product-options-container">
                                {product.options.colors && product.options.colors.length > 0 && (
                                    <div className="color-options">
                                        <h3 className="option-title">Color</h3>
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
                                )}

                                {product.options.storages && product.options.storages.length > 0 && (
                                    <div className="storage-options">
                                        <h3 className="option-title">Almacenamiento</h3>
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
                                )}

                                <div className="quantity-section">
                                    <h3 className="option-title">Cantidad</h3>
                                    <div className="quantity-control-product">
                                        <button
                                            className="quantity-button"
                                            onClick={decreaseQuantity}
                                            disabled={quantity <= 1}
                                        >
                                            -
                                        </button>
                                        <span className="quantity-value">{quantity}</span>
                                        <button
                                            className="quantity-button"
                                            onClick={increaseQuantity}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="add-to-cart-button"
                                disabled={!selectedColor || !selectedStorage || isAddingToCart || !priceIsValid}
                                onClick={handleAddToCart}
                            >
                                {!priceIsValid ? 'Producto sin precio' :
                                    isAddingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage; 