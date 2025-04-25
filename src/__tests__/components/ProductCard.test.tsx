import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Product } from '../../services/api';

// Mock de Link de react-router-dom para evitar errores de navegación
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        Link: ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
            <a href={to} className={className} data-testid="product-link">
                {children}
            </a>
        ),
    };
});

describe('ProductCard', () => {
    const mockProduct: Product = {
        id: '1',
        brand: 'Apple',
        model: 'iPhone 12',
        price: '799',
        imgUrl: 'https://example.com/iphone12.jpg',
        cpu: 'A14',
        ram: '4GB',
        os: 'iOS 14',
        displaySize: '6.1 inches',
        battery: '2815 mAh',
        primaryCamera: '12 MP',
        secondaryCamera: '12 MP',
        dimentions: '146.7 x 71.5 x 7.4 mm',
        weight: '164 g',
        options: {
            colors: [],
            storages: []
        }
    };

    it('renderiza correctamente los detalles básicos del producto', () => {
        render(
            <BrowserRouter>
                <ProductCard product={mockProduct} />
            </BrowserRouter>
        );

        // Verificar que se muestran los detalles básicos
        expect(screen.getByText('Apple')).toBeInTheDocument();
        expect(screen.getByText('iPhone 12')).toBeInTheDocument();
        expect(screen.getByText('799€')).toBeInTheDocument();

        // Verificar que la imagen tiene el alt correcto
        const image = screen.getByAltText('Apple iPhone 12');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/iphone12.jpg');

        // Verificar que hay un enlace al detalle del producto
        const link = screen.getByTestId('product-link');
        expect(link).toHaveAttribute('href', '/product/1');
    });

    it('muestra la insignia de nuevo cuando isNew es true', () => {
        render(
            <BrowserRouter>
                <ProductCard product={mockProduct} isNew={true} />
            </BrowserRouter>
        );

        expect(screen.getByText('Novo')).toBeInTheDocument();
    });

    it('muestra la insignia de descuento cuando isDiscount es true', () => {
        render(
            <BrowserRouter>
                <ProductCard product={mockProduct} isDiscount={true} discountPercentage={20} />
            </BrowserRouter>
        );

        expect(screen.getByText('-20%')).toBeInTheDocument();
    });

    it('muestra tanto la insignia de nuevo como la de descuento cuando ambas son true', () => {
        render(
            <BrowserRouter>
                <ProductCard product={mockProduct} isNew={true} isDiscount={true} discountPercentage={15} />
            </BrowserRouter>
        );

        expect(screen.getByText('Novo')).toBeInTheDocument();
        expect(screen.getByText('-15%')).toBeInTheDocument();
    });

    it('muestra las estrellas de calificación cuando se proporciona rating', () => {
        render(
            <BrowserRouter>
                <ProductCard product={mockProduct} rating={4.5} />
            </BrowserRouter>
        );

        // Verificar que se muestra el valor de calificación
        expect(screen.getByText('4.5')).toBeInTheDocument();

        // Verificar que hay 5 estrellas en total
        const stars = screen.getAllByText('★');
        expect(stars.length).toBe(5);

        // No podemos verificar fácilmente las clases de las estrellas con getByText,
        // pero podemos asumir que el componente maneja esto correctamente
    });

    it('muestra "Precio no disponible" cuando el precio no es válido', () => {
        const invalidPriceProduct = { ...mockProduct, price: 'No disponible' };

        render(
            <BrowserRouter>
                <ProductCard product={invalidPriceProduct} />
            </BrowserRouter>
        );

        expect(screen.getByText('Precio no disponible')).toBeInTheDocument();
    });
});