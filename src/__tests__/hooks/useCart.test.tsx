import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import useCart from '../../hooks/useCart';
import useCartStore from '../../store/cartStore';

// Mock del store de carrito
vi.mock('../../store/cartStore', () => ({
    default: vi.fn()
}));

describe('useCart', () => {
    // Producto de ejemplo para las pruebas
    const mockProduct = {
        id: '1',
        brand: 'Apple',
        model: 'iPhone 12',
        price: '809',
        imgUrl: '/images/iphone12.jpg',
        options: {
            colors: [{ code: 1, name: 'Black' }],
            storages: [{ code: 2, name: '128GB' }]
        }
    };

    // Configuración de mocks antes de cada prueba
    beforeEach(() => {
        vi.resetAllMocks();

        // Configurar el mock del store
        (useCartStore as any).mockReturnValue({
            cartItems: [],
            cartCount: 0,
            addToCart: vi.fn(),
            removeFromCart: vi.fn(),
            updateQuantity: vi.fn(),
            clearCart: vi.fn(),
            addProductToCart: vi.fn().mockResolvedValue({ count: 1 })
        });
    });

    it('debería calcular totales correctamente con carrito vacío', () => {
        const { result } = renderHook(() => useCart());

        expect(result.current.subtotal).toBe(0);
        expect(result.current.shipping).toBe(0);
        expect(result.current.tax).toBe(0);
        expect(result.current.total).toBe(0);
    });

    it('debería calcular totales correctamente con productos en el carrito', () => {
        // Mock del store con elementos en el carrito
        (useCartStore as any).mockReturnValue({
            cartItems: [
                {
                    id: '1-1-2',
                    product: mockProduct,
                    quantity: 2,
                    colorCode: 1,
                    storageCode: 2
                }
            ],
            cartCount: 2,
            addToCart: vi.fn(),
            removeFromCart: vi.fn(),
            updateQuantity: vi.fn(),
            clearCart: vi.fn(),
            addProductToCart: vi.fn().mockResolvedValue({ count: 1 })
        });

        const { result } = renderHook(() => useCart());

        // Precios basados en 2 unidades del producto a 809€ cada uno
        expect(result.current.subtotal).toBe(1618);
        expect(result.current.shipping).toBe(0); // Envío gratis al ser > 100€
        expect(result.current.tax).toBeCloseTo(258.88); // 16% de IVA
        expect(result.current.total).toBeCloseTo(1876.88);
    });

    it('debería calcular gastos de envío para pedidos pequeños', () => {
        // Mock con un producto de precio bajo
        const lowPriceProduct = {
            ...mockProduct,
            price: '49'
        };

        (useCartStore as any).mockReturnValue({
            cartItems: [
                {
                    id: '1-1-2',
                    product: lowPriceProduct,
                    quantity: 1,
                    colorCode: 1,
                    storageCode: 2
                }
            ],
            cartCount: 1,
            addToCart: vi.fn(),
            removeFromCart: vi.fn(),
            updateQuantity: vi.fn(),
            clearCart: vi.fn(),
            addProductToCart: vi.fn().mockResolvedValue({ count: 1 })
        });

        const { result } = renderHook(() => useCart());

        // Cálculos basados en 1 unidad a 49€
        expect(result.current.subtotal).toBe(49);
        expect(result.current.shipping).toBe(10); // Cargo de envío por ser < 100€
        expect(result.current.tax).toBeCloseTo(7.84); // 16% de IVA
        expect(result.current.total).toBeCloseTo(66.84); // 49 + 10 + 7.84
    });

    it('debería formatear precios correctamente', () => {
        const { result } = renderHook(() => useCart());

        // Obtener el formato real usado en la aplicación
        const formatted = result.current.formatPrice(1234.56);
        expect(formatted).toMatch(/1.*234.*56/); // Verificar que el número está formateado con separadores
        expect(formatted).toContain('€'); // Verificar que incluye el símbolo del euro

        expect(result.current.formatPrice(0)).toMatch(/0[,.][0]{2}/); // Verificar formato para cero
    });

    it('debería llamar a addProductToCart del store cuando se añade un producto', async () => {
        const mockAddProductToCartApi = vi.fn().mockResolvedValue({ count: 1 });

        (useCartStore as any).mockReturnValue({
            cartItems: [],
            cartCount: 0,
            addToCart: vi.fn(),
            removeFromCart: vi.fn(),
            updateQuantity: vi.fn(),
            clearCart: vi.fn(),
            addProductToCart: mockAddProductToCartApi
        });

        const { result } = renderHook(() => useCart());

        const request = {
            id: '1',
            colorCode: 1,
            storageCode: 2,
            quantity: 1
        };

        await act(async () => {
            await result.current.addProductToCart(request);
        });

        // Verificar que se llamó a la función del store con los parámetros correctos
        expect(mockAddProductToCartApi).toHaveBeenCalledWith(request);

        // Verificar que los estados se actualizaron correctamente
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.isError).toBe(false);
        expect(result.current.isLoading).toBe(false);
    });

    it('debería manejar errores al añadir productos', async () => {
        const mockError = new Error('Error al añadir al carrito');
        const mockAddProductToCartApi = vi.fn().mockRejectedValue(mockError);

        (useCartStore as any).mockReturnValue({
            cartItems: [],
            cartCount: 0,
            addToCart: vi.fn(),
            removeFromCart: vi.fn(),
            updateQuantity: vi.fn(),
            clearCart: vi.fn(),
            addProductToCart: mockAddProductToCartApi
        });

        const { result } = renderHook(() => useCart());

        const request = {
            id: '1',
            colorCode: 1,
            storageCode: 2,
            quantity: 1
        };

        await act(async () => {
            try {
                await result.current.addProductToCart(request);
                // Si llegamos aquí, la promesa no se rechazó como se esperaba
                expect(true).toBe(false);
            } catch (error) {
                // Verificar que el error es el esperado
                expect(error).toBe(mockError);
            }
        });

        // Verificar que los estados se actualizaron correctamente
        expect(result.current.isSuccess).toBe(false);
        expect(result.current.isError).toBe(true);
        expect(result.current.isLoading).toBe(false);
    });
}); 