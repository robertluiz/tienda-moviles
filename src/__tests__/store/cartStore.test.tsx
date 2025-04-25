import { vi, describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useCartStore from '../../store/cartStore';
import * as api from '../../services/api';

// Mock de la API
vi.mock('../../services/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn()
    }
}));

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

// Tipos para las funciones mockeadas
type MockApiPost = ReturnType<typeof vi.fn<[string, object], Promise<{ data: { count: number } }>>>;
type MockApiGet = ReturnType<typeof vi.fn<[string], Promise<{ data: typeof mockProduct }>>>;

describe('cartStore', () => {
    beforeEach(() => {
        // Resetear los mocks de la API
        vi.resetAllMocks();

        // Resetear el store antes de cada prueba
        act(() => {
            useCartStore.getState().clearCart();
        });
    });

    it('debería inicializarse con un carrito vacío', () => {
        const { result } = renderHook(() => useCartStore());
        expect(result.current.cartItems).toEqual([]);
        expect(result.current.cartCount).toBe(0);
    });

    it('debería añadir un producto al carrito', () => {
        const { result } = renderHook(() => useCartStore());

        act(() => {
            result.current.addToCart(mockProduct, 1, 2);
        });

        // Verificar que se añadió el producto correctamente
        expect(result.current.cartItems.length).toBe(1);
        expect(result.current.cartCount).toBe(1);
        expect(result.current.cartItems[0].product).toEqual(mockProduct);
        expect(result.current.cartItems[0].colorCode).toBe(1);
        expect(result.current.cartItems[0].storageCode).toBe(2);
        expect(result.current.cartItems[0].quantity).toBe(1);
        expect(result.current.cartItems[0].id).toBe('1-1-2');
    });

    it('debería actualizar la cantidad si se añade un producto existente', () => {
        const { result } = renderHook(() => useCartStore());

        // Añadir un producto
        act(() => {
            result.current.addToCart(mockProduct, 1, 2);
        });

        // Volver a añadir el mismo producto con otra cantidad
        act(() => {
            result.current.addToCart(mockProduct, 1, 2, 3);
        });

        // Verificar que se actualizó la cantidad
        expect(result.current.cartItems.length).toBe(1);
        expect(result.current.cartCount).toBe(3);
        expect(result.current.cartItems[0].quantity).toBe(3);
    });

    it('debería añadir un nuevo producto si tiene opciones diferentes', () => {
        const { result } = renderHook(() => useCartStore());

        // Añadir un producto con un código de color
        act(() => {
            result.current.addToCart(mockProduct, 1, 2);
        });

        // Añadir el mismo producto con otro código de color
        act(() => {
            result.current.addToCart(mockProduct, 3, 2);
        });

        // Verificar que se añadieron dos productos separados
        expect(result.current.cartItems.length).toBe(2);
        expect(result.current.cartCount).toBe(2);
        expect(result.current.cartItems[0].id).toBe('1-1-2');
        expect(result.current.cartItems[1].id).toBe('1-3-2');
    });

    it('debería eliminar un producto del carrito', () => {
        const { result } = renderHook(() => useCartStore());

        // Añadir un producto
        act(() => {
            result.current.addToCart(mockProduct, 1, 2);
        });

        // Eliminar el producto
        act(() => {
            result.current.removeFromCart('1-1-2');
        });

        // Verificar que se eliminó el producto
        expect(result.current.cartItems.length).toBe(0);
        expect(result.current.cartCount).toBe(0);
    });

    it('debería actualizar la cantidad de un producto', () => {
        const { result } = renderHook(() => useCartStore());

        // Añadir un producto
        act(() => {
            result.current.addToCart(mockProduct, 1, 2);
        });

        // Actualizar la cantidad
        act(() => {
            result.current.updateQuantity('1-1-2', 5);
        });

        // Verificar que se actualizó la cantidad
        expect(result.current.cartItems[0].quantity).toBe(5);
        expect(result.current.cartCount).toBe(5);
    });

    it('debería vaciar el carrito', () => {
        const { result } = renderHook(() => useCartStore());

        // Añadir varios productos
        act(() => {
            result.current.addToCart(mockProduct, 1, 2);
            result.current.addToCart(mockProduct, 3, 4);
        });

        // Vaciar el carrito
        act(() => {
            result.current.clearCart();
        });

        // Verificar que el carrito está vacío
        expect(result.current.cartItems.length).toBe(0);
        expect(result.current.cartCount).toBe(0);
    });

    it('debería añadir un producto al carrito a través de la API', async () => {
        const { result } = renderHook(() => useCartStore());

        // Mock de la respuesta de la API
        (api.default.post as MockApiPost).mockResolvedValue({
            data: { count: 1 }
        });

        // Mock de la respuesta para obtener los detalles del producto
        (api.default.get as MockApiGet).mockResolvedValue({
            data: mockProduct
        });

        // Añadir un producto a través de la API
        await act(async () => {
            await result.current.addProductToCart({
                id: '1',
                colorCode: 1,
                storageCode: 2,
                quantity: 2
            });
        });

        // Verificar que se llamó a la API con los parámetros correctos
        expect(api.default.post).toHaveBeenCalledWith('/cart', {
            id: '1',
            colorCode: 1,
            storageCode: 2
        });

        // Verificar que se añadió el producto al carrito
        expect(result.current.cartItems.length).toBe(1);
        expect(result.current.cartCount).toBe(2);
        expect(result.current.cartItems[0].quantity).toBe(2);
    });

    it('debería manejar errores al obtener detalles del producto', async () => {
        const { result } = renderHook(() => useCartStore());

        // Mock de la respuesta exitosa para la API del carrito
        (api.default.post as MockApiPost).mockResolvedValue({
            data: { count: 1 }
        });

        // Mock de error al obtener detalles del producto
        (api.default.get as MockApiGet).mockRejectedValue(new Error('Error al obtener producto'));

        // Espiar el console.error para verificar el mensaje de error
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        // Añadir un producto a través de la API
        await act(async () => {
            await result.current.addProductToCart({
                id: '1',
                colorCode: 1,
                storageCode: 2
            });
        });

        // Verificar que se registró el error
        expect(consoleSpy).toHaveBeenCalled();

        // Verificar que se añadió un producto temporal
        expect(result.current.cartItems.length).toBe(1);
        expect(result.current.cartItems[0].product.brand).toBe("Produto");
        expect(result.current.cartItems[0].product.model).toBe("Adicionado");

        // Restaurar el console.error
        consoleSpy.mockRestore();
    });
}); 