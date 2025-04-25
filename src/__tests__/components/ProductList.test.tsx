import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import ProductList from '../../components/ProductList/ProductList';
import { Product } from '../../services/api';

// Mock del componente ProductCard
vi.mock('../../components/ProductCard/ProductCard', () => ({
    default: ({ product }: { product: Product }) => (
        <div data-testid="product-card" data-product-id={product.id}>
            {product.brand} {product.model}
        </div>
    )
}));

describe('ProductList', () => {
    const mockProducts: Product[] = [
        {
            id: '1',
            brand: 'Apple',
            model: 'iPhone 12',
            price: '809',
            imgUrl: '/images/iphone12.jpg',
            options: { colors: [], storages: [] }
        },
        {
            id: '2',
            brand: 'Samsung',
            model: 'Galaxy S21',
            price: '799',
            imgUrl: '/images/galaxys21.jpg',
            options: { colors: [], storages: [] }
        },
        {
            id: '3',
            brand: 'Xiaomi',
            model: 'Mi 11',
            price: '699',
            imgUrl: '/images/mi11.jpg',
            options: { colors: [], storages: [] }
        }
    ];

    it('debería mostrar indicador de carga cuando isLoading es true', () => {
        render(<ProductList products={[]} isLoading={true} />);

        const loadingElement = screen.getByText('Cargando productos...');
        expect(loadingElement).toBeInTheDocument();

        const loadingSpinner = document.querySelector('.loading-spinner');
        expect(loadingSpinner).toBeInTheDocument();
    });

    it('debería mostrar mensaje cuando no hay productos', () => {
        render(<ProductList products={[]} isLoading={false} />);

        const noProductsMessage = screen.getByText('No se encontraron productos con los criterios de búsqueda.');
        expect(noProductsMessage).toBeInTheDocument();

        const helpMessage = screen.getByText('Intente con otra búsqueda o vea todos los productos.');
        expect(helpMessage).toBeInTheDocument();
    });

    it('debería mostrar la cantidad de productos encontrados', () => {
        render(<ProductList products={mockProducts} isLoading={false} />);

        const productCount = screen.getByText('3 productos encontrados');
        expect(productCount).toBeInTheDocument();
    });

    it('debería renderizar una tarjeta por cada producto', () => {
        render(<ProductList products={mockProducts} isLoading={false} />);

        const productCards = screen.getAllByTestId('product-card');
        expect(productCards).toHaveLength(3);

        // Verificar que cada producto se muestre correctamente
        expect(screen.getByText('Apple iPhone 12')).toBeInTheDocument();
        expect(screen.getByText('Samsung Galaxy S21')).toBeInTheDocument();
        expect(screen.getByText('Xiaomi Mi 11')).toBeInTheDocument();
    });

    it('debería pasar las props correctas a cada ProductCard', () => {
        render(<ProductList products={mockProducts} isLoading={false} />);

        // Obtenemos todas las tarjetas de producto
        const productCards = screen.getAllByTestId('product-card');

        // Verificamos que cada tarjeta tenga el ID correcto del producto correspondiente
        expect(productCards[0]).toHaveAttribute('data-product-id', mockProducts[0].id);
        expect(productCards[1]).toHaveAttribute('data-product-id', mockProducts[1].id);
        expect(productCards[2]).toHaveAttribute('data-product-id', mockProducts[2].id);
    });
}); 