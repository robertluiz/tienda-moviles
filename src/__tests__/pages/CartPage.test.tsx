import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CartPage from '../../pages/CartPage/CartPage';

// Mock del hook useCart
const mockRemoveFromCart = vi.fn();
const mockUpdateQuantity = vi.fn();
const mockClearCart = vi.fn();
const mockFormatPrice = vi.fn().mockImplementation((price) => `€${price.toFixed(2)}`);

// Producto de prueba para el carrito
const mockCartItem = {
    id: 'item1',
    product: {
        id: '1',
        brand: 'Apple',
        model: 'iPhone 12',
        price: '809',
        imgUrl: '/images/iphone12.jpg',
        options: {
            colors: [
                { code: 1, name: 'Negro' },
                { code: 2, name: 'Blanco' }
            ],
            storages: [
                { code: 3, name: '64GB' },
                { code: 4, name: '128GB' }
            ]
        }
    },
    colorCode: 1,
    storageCode: 3,
    quantity: 2
};

// Mock de useCart usando vi.mock con variable hoisted
const mockUseCart = vi.fn();
vi.mock('../../hooks/useCart', () => ({
    default: () => mockUseCart()
}));

// Mock del componente Layout
vi.mock('../../components/Layout/Layout', () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mock-layout">{children}</div>
    )
}));

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock predeterminado para carrito vacío
        mockUseCart.mockReturnValue({
            cartItems: [],
            cartCount: 0,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            clearCart: mockClearCart,
            subtotal: 0,
            shipping: 0,
            tax: 0,
            total: 0,
            formatPrice: mockFormatPrice
        });
    });

    it('debería mostrar mensaje de carrito vacío cuando no hay items', () => {
        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument();
        expect(screen.getByText('Añade productos a tu carrito para comenzar')).toBeInTheDocument();
        expect(screen.getByText('Continuar comprando')).toBeInTheDocument();
    });

    it('debería mostrar los items del carrito cuando hay productos', () => {
        // Configurar el mock para incluir items
        mockUseCart.mockReturnValue({
            cartItems: [mockCartItem],
            cartCount: 2,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            clearCart: mockClearCart,
            subtotal: 1618,
            shipping: 0,
            tax: 258.88,
            total: 1876.88,
            formatPrice: mockFormatPrice
        });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Tu Carrito de Compras')).toBeInTheDocument();
        expect(screen.getByText('2 artículos')).toBeInTheDocument();
        expect(screen.getByText('VACIAR CARRITO')).toBeInTheDocument();
        expect(screen.getByText('Apple iPhone 12')).toBeInTheDocument();
        expect(screen.getByText('Color: Negro')).toBeInTheDocument();
        expect(screen.getByText('Almacenamiento: 64GB')).toBeInTheDocument();
        expect(screen.getByText('ELIMINAR')).toBeInTheDocument();
    });

    it('debería mostrar la palabra "artículo" (singular) cuando hay solo 1 producto', () => {
        mockUseCart.mockReturnValue({
            cartItems: [{ ...mockCartItem, quantity: 1 }],
            cartCount: 1,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            clearCart: mockClearCart,
            subtotal: 809,
            shipping: 0,
            tax: 129.44,
            total: 938.44,
            formatPrice: mockFormatPrice
        });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        expect(screen.getByText('1 artículo')).toBeInTheDocument();
    });

    it('debería mostrar el resumen del pedido con los cálculos correctos', () => {
        mockUseCart.mockReturnValue({
            cartItems: [mockCartItem],
            cartCount: 2,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            clearCart: mockClearCart,
            subtotal: 1618,
            shipping: 0,
            tax: 258.88,
            total: 1876.88,
            formatPrice: mockFormatPrice
        });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        // Obtener el elemento del resumen y hacer el casting a HTMLElement
        const cartSummaryHeading = screen.getByText('Resumen del Pedido');
        const cartSummary = cartSummaryHeading.closest('.cart-summary') as HTMLElement;
        expect(cartSummary).toBeInTheDocument();

        expect(screen.getByText('Subtotal')).toBeInTheDocument();
        expect(screen.getAllByText('€1618.00')[1]).toBeInTheDocument();
        expect(screen.getByText('Impuestos (16%)')).toBeInTheDocument();
        expect(screen.getByText('€258.88')).toBeInTheDocument();
        expect(screen.getByText('Envío')).toBeInTheDocument();
        expect(screen.getByText('Gratis')).toBeInTheDocument();
        expect(screen.getByText('Total')).toBeInTheDocument();
        expect(screen.getByText('€1876.88')).toBeInTheDocument();
        expect(screen.getByText('FINALIZAR COMPRA')).toBeInTheDocument();
    });

    it('debería mostrar envío con costo cuando el subtotal es menor a 100', () => {
        mockUseCart.mockReturnValue({
            cartItems: [mockCartItem],
            cartCount: 1,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            clearCart: mockClearCart,
            subtotal: 80,
            shipping: 10,
            tax: 12.8,
            total: 102.8,
            formatPrice: mockFormatPrice
        });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        expect(screen.getByText('€10.00')).toBeInTheDocument();
        expect(screen.getByText('Envío gratis en compras mayores a €100.00')).toBeInTheDocument();
    });

    it('debería llamar a clearCart cuando se hace clic en VACIAR CARRITO', () => {
        mockUseCart.mockReturnValue({
            cartItems: [mockCartItem],
            cartCount: 2,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            clearCart: mockClearCart,
            subtotal: 1618,
            shipping: 0,
            tax: 258.88,
            total: 1876.88,
            formatPrice: mockFormatPrice
        });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        const clearCartButton = screen.getByText('VACIAR CARRITO');
        fireEvent.click(clearCartButton);

        expect(mockClearCart).toHaveBeenCalledTimes(1);
    });

    it('debería llamar a removeFromCart cuando se hace clic en ELIMINAR', () => {
        mockUseCart.mockReturnValue({
            cartItems: [mockCartItem],
            cartCount: 2,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            clearCart: mockClearCart,
            subtotal: 1618,
            shipping: 0,
            tax: 258.88,
            total: 1876.88,
            formatPrice: mockFormatPrice
        });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        const removeButton = screen.getByText('ELIMINAR');
        fireEvent.click(removeButton);

        expect(mockRemoveFromCart).toHaveBeenCalledTimes(1);
        expect(mockRemoveFromCart).toHaveBeenCalledWith('item1');
    });

    it('debería llamar a updateQuantity cuando se hace clic en los botones de cantidad', () => {
        mockUseCart.mockReturnValue({
            cartItems: [mockCartItem],
            cartCount: 2,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            clearCart: mockClearCart,
            subtotal: 1618,
            shipping: 0,
            tax: 258.88,
            total: 1876.88,
            formatPrice: mockFormatPrice
        });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        const incrementButton = screen.getByText('+');
        fireEvent.click(incrementButton);

        expect(mockUpdateQuantity).toHaveBeenCalledTimes(1);
        expect(mockUpdateQuantity).toHaveBeenCalledWith('item1', 3);

        const decrementButton = screen.getByText('-');
        fireEvent.click(decrementButton);

        expect(mockUpdateQuantity).toHaveBeenCalledTimes(2);
        expect(mockUpdateQuantity).toHaveBeenCalledWith('item1', 1);
    });

    it('debería deshabilitar el botón de decremento cuando la cantidad es 1', () => {
        mockUseCart.mockReturnValue({
            cartItems: [{ ...mockCartItem, quantity: 1 }],
            cartCount: 1,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            clearCart: mockClearCart,
            subtotal: 809,
            shipping: 0,
            tax: 129.44,
            total: 938.44,
            formatPrice: mockFormatPrice
        });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        const decrementButton = screen.getByText('-');
        expect(decrementButton).toBeDisabled();

        const incrementButton = screen.getByText('+');
        expect(incrementButton).not.toBeDisabled();
    });

    it('debería tener enlaces para continuar comprando y finalizar compra', () => {
        mockUseCart.mockReturnValue({
            cartItems: [mockCartItem],
            cartCount: 2,
            removeFromCart: mockRemoveFromCart,
            updateQuantity: mockUpdateQuantity,
            clearCart: mockClearCart,
            subtotal: 1618,
            shipping: 0,
            tax: 258.88,
            total: 1876.88,
            formatPrice: mockFormatPrice
        });

        render(
            <MemoryRouter>
                <CartPage />
            </MemoryRouter>
        );

        const finalizarCompraLink = screen.getByText('FINALIZAR COMPRA');
        expect(finalizarCompraLink).toBeInTheDocument();
        expect(finalizarCompraLink.closest('a') as HTMLAnchorElement).toHaveAttribute('href', '/checkout');

        const continuarComprandoLink = screen.getByText('Continuar comprando');
        expect(continuarComprandoLink).toBeInTheDocument();
        expect(continuarComprandoLink.closest('a') as HTMLAnchorElement).toHaveAttribute('href', '/');
    });
}); 