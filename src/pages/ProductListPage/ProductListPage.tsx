import { useState } from 'react';
import Header from '../../components/Header/Header';
import SearchBar from '../../components/SearchBar/SearchBar';
import ProductList from '../../components/ProductList/ProductList';
import useProducts from '../../hooks/useProducts';

const ProductListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { products, isLoading, error } = useProducts(searchTerm);

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    return (
        <div>
            <Header />
            <main className="container">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <SearchBar onSearch={handleSearch} />
                </div>

                {error ? (
                    <p>Error al cargar los productos. Por favor, inténtelo más tarde.</p>
                ) : (
                    <ProductList products={products} isLoading={isLoading} />
                )}
            </main>
        </div>
    );
};

export default ProductListPage; 