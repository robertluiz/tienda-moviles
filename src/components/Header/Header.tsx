import { Link, useLocation } from 'react-router-dom';
import CartWidget from '../CartWidget/CartWidget';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isProductsPage = location.pathname === '/productos';
  const isCartPage = location.pathname === '/cart';

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

        {!isHomePage && (
          <div className="breadcrumbs">
            <ul>
              <li>
                <Link to="/">Inicio</Link>
              </li>
              {!isCartPage && (
                <li className="active">
                  {isProductsPage ? 'Productos' : 'Producto'}
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