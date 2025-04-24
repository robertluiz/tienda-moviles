import { Link, useLocation } from 'react-router-dom';
import CartWidget from '../CartWidget/CartWidget';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isProductsPage = location.pathname === '/productos';

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          <div className="logo">
            <Link to="/">
              <h1>Tienda Móviles</h1>
            </Link>
          </div>

          <nav className="main-nav">
            <ul>
              <li className={isHomePage ? 'active' : ''}>
                <Link to="/">Inicio</Link>
              </li>
              <li className={isProductsPage ? 'active' : ''}>
                <Link to="/productos">Productos</Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <CartWidget />
          </div>
        </div>

        <div className="breadcrumbs">
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            {!isHomePage && (
              <li className="active">
                {isProductsPage ? 'Productos' : 'Producto'}
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header; 