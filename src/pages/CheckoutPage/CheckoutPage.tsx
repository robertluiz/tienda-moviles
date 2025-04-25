import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import useCart from '../../hooks/useCart';
import useCheckout from '../../hooks/useCheckout';
import { CheckoutRequest } from '../../services/api';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const { cartItems, subtotal, shipping, tax, total, formatPrice } = useCart();
    const { isLoading, isSuccess, isError, submitCheckout } = useCheckout();

    const [formData, setFormData] = useState<CheckoutRequest['customerDetails']>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: ''
    });

    const [formErrors, setFormErrors] = useState<Partial<Record<keyof CheckoutRequest['customerDetails'], string>>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Partial<Record<keyof CheckoutRequest['customerDetails'], string>> = {};

        if (!formData.firstName.trim()) {
            errors.firstName = 'El nombre es obligatorio';
        }

        if (!formData.lastName.trim()) {
            errors.lastName = 'El apellido es obligatorio';
        }

        if (!formData.email.trim()) {
            errors.email = 'El email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'El formato del email no es válido';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'El teléfono es obligatorio';
        } else if (!/^\d{9,}$/.test(formData.phone.replace(/\s/g, ''))) {
            errors.phone = 'El teléfono debe tener al menos 9 dígitos';
        }

        if (!formData.address.trim()) {
            errors.address = 'La dirección es obligatoria';
        }

        if (!formData.city.trim()) {
            errors.city = 'La ciudad es obligatoria';
        }

        if (!formData.zipCode.trim()) {
            errors.zipCode = 'El código postal es obligatorio';
        } else if (!/^\d{5}$/.test(formData.zipCode)) {
            errors.zipCode = 'El código postal debe tener 5 dígitos';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const response = await submitCheckout(formData);

        if (response.success) {
            navigate('/checkout/success', {
                state: {
                    orderId: response.orderId,
                    customerName: `${formData.firstName} ${formData.lastName}`
                }
            });
        }
    };

    if (!cartItems.length) {
        return (
            <Layout>
                <div className="checkout-empty">
                    <h2>No puedes realizar el checkout</h2>
                    <p>Tu carrito está vacío. Añade productos para continuar.</p>
                    <Link to="/" className="continue-shopping-button">
                        Ir a la tienda
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="checkout-container">
                <h1 className="checkout-title">Finalizar Compra</h1>

                <div className="checkout-grid">
                    <div className="checkout-form-container">
                        <h2 className="checkout-section-title">Datos de Envío</h2>

                        <form className="checkout-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">Nombre</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className={formErrors.firstName ? 'error' : ''}
                                    />
                                    {formErrors.firstName && <span className="error-message">{formErrors.firstName}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Apellidos</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className={formErrors.lastName ? 'error' : ''}
                                    />
                                    {formErrors.lastName && <span className="error-message">{formErrors.lastName}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={formErrors.email ? 'error' : ''}
                                    />
                                    {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Teléfono</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={formErrors.phone ? 'error' : ''}
                                    />
                                    {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Dirección</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className={formErrors.address ? 'error' : ''}
                                />
                                {formErrors.address && <span className="error-message">{formErrors.address}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">Ciudad</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={formErrors.city ? 'error' : ''}
                                    />
                                    {formErrors.city && <span className="error-message">{formErrors.city}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="zipCode">Código Postal</label>
                                    <input
                                        type="text"
                                        id="zipCode"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className={formErrors.zipCode ? 'error' : ''}
                                    />
                                    {formErrors.zipCode && <span className="error-message">{formErrors.zipCode}</span>}
                                </div>
                            </div>

                            <div className="checkout-actions">
                                <Link to="/cart" className="back-to-cart">
                                    Volver al carrito
                                </Link>

                                <button
                                    type="submit"
                                    className="submit-order-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Procesando...' : 'Finalizar pedido'}
                                </button>
                            </div>

                            {isError && (
                                <div className="checkout-error">
                                    Se ha producido un error al procesar el pedido. Por favor, inténtalo de nuevo.
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="checkout-summary">
                        <h2 className="checkout-section-title">Resumen del Pedido</h2>

                        <div className="checkout-items">
                            {cartItems.map((item) => (
                                <div key={item.id} className="checkout-item">
                                    <div className="checkout-item-details">
                                        <div className="checkout-item-image">
                                            <img src={item.product.imgUrl} alt={`${item.product.brand} ${item.product.model}`} />
                                        </div>
                                        <div className="checkout-item-info">
                                            <h4 className="checkout-item-title">
                                                {item.product.brand} {item.product.model}
                                            </h4>
                                            <div className="checkout-item-options">
                                                {item.product.options.colors && (
                                                    <span className="checkout-item-option">
                                                        Color: {item.product.options.colors.find(c => c.code === item.colorCode)?.name}
                                                    </span>
                                                )}
                                                {item.product.options.storages && (
                                                    <span className="checkout-item-option">
                                                        Almacenamiento: {item.product.options.storages.find(s => s.code === item.storageCode)?.name}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="checkout-item-quantity">
                                                Cantidad: {item.quantity}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="checkout-item-price">
                                        {formatPrice(parseFloat(item.product.price) * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="checkout-totals">
                            <div className="checkout-summary-row">
                                <span className="checkout-summary-label">Subtotal</span>
                                <span className="checkout-summary-value">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="checkout-summary-row">
                                <span className="checkout-summary-label">Impuestos (16%)</span>
                                <span className="checkout-summary-value">{formatPrice(tax)}</span>
                            </div>
                            <div className="checkout-summary-row">
                                <span className="checkout-summary-label">Envío</span>
                                <span className="checkout-summary-value">{shipping > 0 ? formatPrice(shipping) : 'Gratis'}</span>
                            </div>
                            <div className="checkout-summary-total checkout-summary-row">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutPage; 