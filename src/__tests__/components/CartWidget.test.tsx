import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import CartWidget from '../../components/CartWidget/CartWidget';
import useCartStore from '../../store/cartStore';
import { describe, it, expect, vi, beforeEach, afterEach, MockInstance } from 'vitest';


vi.mock('../../store/cartStore', () => ({
    default: vi.fn()
}));

// Mock Link de react-router-dom para evitar errores
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        Link: ({ to, children, className, onClick }: { to: string; children: React.ReactNode; className?: string; onClick?: () => void }) => (
            <a href={to} className={className} onClick={onClick} data-testid={`link-to-${to}`}>
                {children}
            </a>
        ),
    };
});

interface MockCartStore {
    cartCount: number;
    showTooltip?: boolean;
}

describe('CartWidget', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        (useCartStore as unknown as MockInstance).mockReset();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('displays the cart count correctly', () => {
        (useCartStore as unknown as MockInstance).mockImplementation((): MockCartStore => ({
            cartCount: 3
        }));

        render(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('does not display cart count when it is 0', () => {
        (useCartStore as unknown as MockInstance).mockImplementation((): MockCartStore => ({
            cartCount: 0
        }));

        render(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        expect(screen.queryByText('0')).not.toBeInTheDocument();
    });

    it('shows tooltip when cart count increases', () => {
        let countState = 0;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        const { rerender, container } = render(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Aumentar el contador para activar el tooltip
        countState = 1;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        rerender(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Verificar que aparece el tooltip
        expect(screen.getByText('Producto añadido al carrito')).toBeInTheDocument();

        // Verificar el contenido del tooltip usando selectores más específicos
        const tooltipContent = container.querySelector('.cart-tooltip-message');
        expect(tooltipContent).toBeInTheDocument();
        expect(tooltipContent?.textContent).toContain("Has añadido");

        const productSpan = container.querySelector('.cart-tooltip-product');
        expect(productSpan).toBeInTheDocument();
        expect(productSpan?.textContent?.trim()).toBe("1 producto");
    });

    it('shows tooltip with multiple products message', () => {
        let countState = 1;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        const { rerender, container } = render(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Aumentar el contador para activar el tooltip con múltiples productos
        countState = 3;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        rerender(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Verificar que aparece el tooltip
        expect(screen.getByText('Producto añadido al carrito')).toBeInTheDocument();

        // Verificar el contenido del tooltip usando selectores más específicos
        const tooltipContent = container.querySelector('.cart-tooltip-message');
        expect(tooltipContent).toBeInTheDocument();
        expect(tooltipContent?.textContent).toContain("Has añadido");

        const productSpan = container.querySelector('.cart-tooltip-product');
        expect(productSpan).toBeInTheDocument();
        expect(productSpan?.textContent?.trim()).toBe("3 productos");
    });

    it('closes tooltip after 5 seconds automatically', () => {
        let countState = 0;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        const { rerender } = render(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Aumentar el contador para activar el tooltip
        countState = 1;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        rerender(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Verificar que aparece el tooltip
        expect(screen.getByText('Producto añadido al carrito')).toBeInTheDocument();

        // Avanzar el tiempo para que se cierre automáticamente
        act(() => {
            vi.advanceTimersByTime(5000);
        });

        // Verificar que el tooltip desapareció
        expect(screen.queryByText('Producto añadido al carrito')).not.toBeInTheDocument();
    });

    it('closes tooltip when clicking close button', () => {
        let countState = 0;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        const { rerender } = render(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Aumentar el contador para activar el tooltip
        countState = 1;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        rerender(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Verificar que aparece el tooltip
        expect(screen.getByText('Producto añadido al carrito')).toBeInTheDocument();

        // Hacer clic en el botón de cerrar
        const closeButton = screen.getByRole('button', { name: '' });
        fireEvent.click(closeButton);

        // Verificar que el tooltip desapareció
        expect(screen.queryByText('Producto añadido al carrito')).not.toBeInTheDocument();
    });

    it('closes tooltip when clicking "Seguir comprando"', () => {
        let countState = 0;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        const { rerender } = render(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Aumentar el contador para activar el tooltip
        countState = 1;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        rerender(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Verificar que aparece el tooltip
        expect(screen.getByText('Producto añadido al carrito')).toBeInTheDocument();

        // Hacer clic en el enlace "Seguir comprando"
        const seguirComprandoLink = screen.getByText('Seguir comprando');
        fireEvent.click(seguirComprandoLink);

        // Verificar que el tooltip desapareció
        expect(screen.queryByText('Producto añadido al carrito')).not.toBeInTheDocument();
    });

    it('closes tooltip when clicking "Ver carrito"', () => {
        let countState = 0;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        const { rerender } = render(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Aumentar el contador para activar el tooltip
        countState = 1;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        rerender(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Verificar que aparece el tooltip
        expect(screen.getByText('Producto añadido al carrito')).toBeInTheDocument();

        // Hacer clic en el enlace "Ver carrito"
        const verCarritoLink = screen.getByText('Ver carrito');
        fireEvent.click(verCarritoLink);

        // Verificar que el tooltip desapareció
        expect(screen.queryByText('Producto añadido al carrito')).not.toBeInTheDocument();
    });

    it('handles tooltip visibility correctly', () => {
        (useCartStore as unknown as MockInstance).mockImplementation((): MockCartStore => ({
            cartCount: 1
        }));

        const { container } = render(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        expect(container.querySelector('.cart-icon')).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('displays cart counter badge correctly', () => {
        (useCartStore as unknown as MockInstance).mockImplementation((): MockCartStore => ({
            cartCount: 2
        }));

        render(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        expect(screen.getByText('2')).toBeInTheDocument();

        const cartCountElement = screen.getByText('2');
        expect(cartCountElement).toHaveClass('cart-count');
    });

    it('clears existing timeout when cart count increases again', () => {
        let countState = 0;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        const { rerender } = render(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Aumentar el contador para activar el tooltip por primera vez
        countState = 1;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        rerender(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Verificar que aparece el tooltip
        expect(screen.getByText('Producto añadido al carrito')).toBeInTheDocument();

        // Aumentar el contador nuevamente antes de que expire el primer timeout
        countState = 2;

        (useCartStore as unknown as MockInstance).mockImplementation(() => ({
            cartCount: countState
        }));

        rerender(
            <BrowserRouter>
                <CartWidget />
            </BrowserRouter>
        );

        // Verificar que el tooltip sigue visible
        expect(screen.getByText('Producto añadido al carrito')).toBeInTheDocument();

        // Avanzar el tiempo para que se cierre automáticamente
        act(() => {
            vi.advanceTimersByTime(5000);
        });

        // Verificar que el tooltip desapareció después del segundo timeout
        expect(screen.queryByText('Producto añadido al carrito')).not.toBeInTheDocument();
    });
}); 