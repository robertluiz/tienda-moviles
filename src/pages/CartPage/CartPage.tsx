import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import Layout from '../../components/Layout/Layout';
import './CartPage.css';

const CartPage = () => {
    const {
        cartItems,
        cartCount,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        shipping,
        tax,
        total,
        formatPrice
    } = useCart();

    if (!cartItems.length) {
        return (
            <Layout>
                <div className="cart-empty">
                    <h2>Tu carrito está vacío</h2>
                    <p>Añade productos a tu carrito para comenzar</p>
                    <Link to="/" className="continue-shopping-button">
                        Continuar comprando
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="cart-header">
                <h1 className="cart-title">Tu Carrito de Compras</h1>
                <span className="cart-count">{cartCount} {cartCount === 1 ? 'artículo' : 'artículos'}</span>
                <button className="clear-cart-button" onClick={clearCart}>
                    VACIAR CARRITO
                </button>
            </div>

            <div className="cart-grid">
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item-image">
                                <img src={item.product.imgUrl} alt={`${item.product.brand} ${item.product.model}`} />
                            </div>
                            <div className="cart-item-content">
                                <div className="cart-item-info">
                                    <h3 className="cart-item-title">
                                        <Link to={`/product/${item.product.id}`}>
                                            {item.product.brand} {item.product.model}
                                        </Link>
                                    </h3>
                                    <div className="cart-item-options">
                                        {item.product.options.colors && (
                                            <span className="cart-item-option">
                                                Color: {item.product.options.colors.find(c => c.code === item.colorCode)?.name}
                                            </span>
                                        )}
                                        {item.product.options.storages && (
                                            <span className="cart-item-option">
                                                Almacenamiento: {item.product.options.storages.find(s => s.code === item.storageCode)?.name}
                                            </span>
                                        )}
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="quantity-control">
                                            <button
                                                className="quantity-button"
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button
                                                className="quantity-button"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button className="cart-item-action" onClick={() => removeFromCart(item.id)}>
                                            ELIMINAR
                                        </button>
                                    </div>
                                </div>
                                <div className="cart-item-price">
                                    {formatPrice(parseFloat(item.product.price) * item.quantity)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2 className="cart-summary-title">Resumen del Pedido</h2>
                    <div className="cart-summary-row">
                        <span className="cart-summary-label">Subtotal</span>
                        <span className="cart-summary-value">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="cart-summary-row">
                        <span className="cart-summary-label">Impuestos (16%)</span>
                        <span className="cart-summary-value">{formatPrice(tax)}</span>
                    </div>
                    <div className="cart-summary-row">
                        <span className="cart-summary-label">Envío</span>
                        <span className="cart-summary-value">{shipping > 0 ? formatPrice(shipping) : 'Gratis'}</span>
                    </div>
                    {shipping > 0 && (
                        <div className="shipping-note">
                            Envío gratis en compras mayores a {formatPrice(100)}
                        </div>
                    )}
                    <div className="cart-summary-total cart-summary-row">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <Link to="/checkout" className="checkout-button">
                        FINALIZAR COMPRA
                    </Link>
                    <Link to="/" className="continue-shopping">
                        Continuar comprando
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default CartPage; 