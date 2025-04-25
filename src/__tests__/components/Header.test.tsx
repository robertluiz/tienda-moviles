import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Header from '../../components/Header/Header';

// Crear los mocks antes de importarlos
const mockUseLocation = vi.fn();

// Mock para react-router-dom
vi.mock('react-router-dom', () => ({
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
        <a href={to} data-testid="mock-link">
            {children}
        </a>
    ),
    useLocation: () => mockUseLocation()
}));

// Mock para el componente CartWidget
vi.mock('../../components/CartWidget/CartWidget', () => ({
    default: () => <div data-testid="mock-cart-widget">CartWidget</div>
}));

describe('Header', () => {
    beforeEach(() => {
        mockUseLocation.mockReset();
    });

    it('debería renderizar correctamente con el título de la tienda', () => {
        mockUseLocation.mockReturnValue({ pathname: '/' });
        render(<Header />);

        const title = screen.getByText('Tienda Móviles');
        expect(title).toBeInTheDocument();

        const logo = screen.getByRole('heading', { level: 1 });
        expect(logo).toBeInTheDocument();
        expect(logo).toHaveTextContent('Tienda Móviles');
    });

    it('debería renderizar el CartWidget', () => {
        mockUseLocation.mockReturnValue({ pathname: '/' });
        render(<Header />);

        const cartWidget = screen.getByTestId('mock-cart-widget');
        expect(cartWidget).toBeInTheDocument();
    });

    it('no debería mostrar migas de pan en la página principal', () => {
        mockUseLocation.mockReturnValue({ pathname: '/' });
        render(<Header />);

        const breadcrumbs = screen.queryByText('Inicio');
        expect(breadcrumbs).not.toBeInTheDocument();
    });

    it('debería mostrar migas de pan en la página de producto', () => {
        mockUseLocation.mockReturnValue({ pathname: '/product/123' });
        render(<Header />);

        const homeLink = screen.getByText('Inicio');
        expect(homeLink).toBeInTheDocument();

        const productText = screen.getByText('Producto');
        expect(productText).toBeInTheDocument();
    });

    it('debería mostrar migas de pan en la página de carrito', () => {
        mockUseLocation.mockReturnValue({ pathname: '/cart' });
        render(<Header />);

        const homeLink = screen.getByText('Inicio');
        expect(homeLink).toBeInTheDocument();

        const cartText = screen.getByText('Carrito de Compras');
        expect(cartText).toBeInTheDocument();
    });

    it('debería tener un enlace a la página principal en el logo', () => {
        mockUseLocation.mockReturnValue({ pathname: '/' });
        render(<Header />);

        const homeLink = screen.getByTestId('mock-link');
        expect(homeLink).toHaveAttribute('href', '/');
    });

    it('debería tener un enlace a la página principal en las migas de pan', () => {
        mockUseLocation.mockReturnValue({ pathname: '/cart' });
        render(<Header />);

        const breadcrumbLinks = screen.getAllByTestId('mock-link');
        expect(breadcrumbLinks[1]).toHaveTextContent('Inicio');
        expect(breadcrumbLinks[1]).toHaveAttribute('href', '/');
    });
}); 