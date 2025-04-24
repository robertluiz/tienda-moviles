import { Routes, Route } from 'react-router-dom';
import ProductListPage from './pages/ProductListPage/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage';
import CartPage from './pages/CartPage/CartPage';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<ProductListPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
        </Routes>
    );
};

export default App; 