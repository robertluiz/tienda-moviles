import { Link, useLocation } from 'react-router-dom';
import CartWidget from '../CartWidget/CartWidget';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const isCartPage = location.pathname === '/cart';
  const isProductDetailPage = location.pathname.startsWith('/product/');

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          <div className="logo">
            <Link to="/">
              <h1>Tienda Móviles</h1>
            </Link>
          </div>

          <div className="header-actions">
            <CartWidget />
          </div>
        </div>

        {(isCartPage || isProductDetailPage) && (
          <div className="breadcrumbs">
            <ul>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              {isProductDetailPage && (
                <li className="active">
                  Producto
                </li>
              )}
              {isCartPage && (
                <li className="active">
                  Carrito de Compras
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 