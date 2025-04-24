import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import './CartWidget.css';

const CartWidget = () => {
    const { cartCount, lastAddedProduct, clearLastAddedProduct } = useCartStore();
    const [showTooltip, setShowTooltip] = useState(false);
    const [animate, setAnimate] = useState(false);
    const prevCountRef = useRef(cartCount);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Mostrar tooltip solo si el carrito incrementa y hay un producto añadido
        if (cartCount > prevCountRef.current && lastAddedProduct) {
            setShowTooltip(true);
            setAnimate(true);

            // Ocultar tooltip después de 5 segundos
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setShowTooltip(false);
                clearLastAddedProduct();
            }, 5000);
        }

        prevCountRef.current = cartCount;

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [cartCount, lastAddedProduct, clearLastAddedProduct]);

    const handleCloseTooltip = () => {
        setShowTooltip(false);
        clearLastAddedProduct();

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    return (
        <div className={`cart-widget ${showTooltip ? 'active' : ''}`}>
            <Link to="/carrito" className="cart-icon">
                <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </span>
                {cartCount > 0 && (
                    <span className={`cart-count ${animate ? 'animate' : ''}`}>
                        {cartCount}
                    </span>
                )}
            </Link>

            {showTooltip && lastAddedProduct && (
                <div className="cart-tooltip">
                    <div className="cart-tooltip-header">
                        <h4 className="cart-tooltip-title">Producto añadido al carrito</h4>
                        <button className="cart-tooltip-close" onClick={handleCloseTooltip}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div className="cart-tooltip-content">
                        <p className="cart-tooltip-message">
                            Has añadido <span className="cart-tooltip-product">{cartCount} {cartCount === 1 ? 'producto' : 'productos'}</span> a tu carrito.
                        </p>
                    </div>
                    <div className="cart-tooltip-actions">
                        <Link to="/" className="cart-tooltip-action secondary" onClick={handleCloseTooltip}>
                            Seguir comprando
                        </Link>
                        <Link to="/carrito" className="cart-tooltip-action" onClick={handleCloseTooltip}>
                            Ver carrito
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartWidget; 