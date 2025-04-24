import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import './Header.css';

const Header = () => {
  const { cartCount } = useCartStore();

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
              <li>
                <Link to="/">Inicio</Link>
              </li>
              <li>
                <Link to="/productos">Productos</Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <Link to="/carrito" className="cart-icon">
              <span className="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </span>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
        </div>

        <div className="breadcrumbs">
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li className="active">Productos</li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header; 