import { Link, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import './CheckoutSuccessPage.css';

interface LocationState {
    orderId?: string;
    customerName?: string;
}

const CheckoutSuccessPage = () => {
    const location = useLocation();
    const state = location.state as LocationState | null;

    const orderId = state?.orderId || 'N/A';
    const customerName = state?.customerName || 'Cliente';

    return (
        <Layout>
            <div className="success-container">
                <div className="success-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>

                <h1 className="success-title">¡Pedido Completado!</h1>

                <div className="success-message">
                    <p>
                        Gracias, <strong>{customerName}</strong>, por tu compra. Hemos recibido tu pedido y está siendo procesado.
                    </p>
                    <p>Tu número de pedido es: <strong>{orderId}</strong></p>
                    <p>Recibirás un email con los detalles de tu compra y la información de seguimiento.</p>
                </div>

                <div className="order-summary-note">
                    <h3>¿Qué sigue?</h3>
                    <ul>
                        <li>Recibirás un email de confirmación en breve</li>
                        <li>Prepararemos tu pedido para el envío</li>
                        <li>Te notificaremos cuando tu pedido sea enviado</li>
                    </ul>
                </div>

                <div className="success-actions">
                    <Link to="/" className="back-to-home">
                        Volver a la tienda
                    </Link>
                </div>
            </div>
        </Layout>
    );
};

export default CheckoutSuccessPage; 