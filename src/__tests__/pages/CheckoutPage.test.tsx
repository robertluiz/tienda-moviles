import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import CheckoutPage from '../../pages/CheckoutPage/CheckoutPage';

// Mock para useNavigate de react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

// Mock del hook useCart
const mockFormatPrice = vi.fn().mockImplementation((price) => {
    if (price === undefined || price === null) return '€0.00';
    return `€${price.toFixed(2)}`;
});
const mockClearCart = vi.fn();

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

// Mock de useCart
const mockUseCart = vi.fn();
vi.mock('../../hooks/useCart', () => ({
    default: () => mockUseCart()
}));

// Mock de useCheckout
const mockSubmitCheckout = vi.fn();
const mockUseCheckout = vi.fn();
vi.mock('../../hooks/useCheckout', () => ({
    default: () => mockUseCheckout()
}));

// Mock del componente Layout
vi.mock('../../components/Layout/Layout', () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mock-layout">{children}</div>
    )
}));

describe('CheckoutPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Mock predeterminado para carrito con items
        mockUseCart.mockReturnValue({
            cartItems: [mockCartItem],
            subtotal: 1618,
            shipping: 0,
            tax: 258.88,
            total: 1876.88,
            formatPrice: mockFormatPrice,
            clearCart: mockClearCart
        });

        // Mock predeterminado para checkout
        mockUseCheckout.mockReturnValue({
            isLoading: false,
            isSuccess: false,
            isError: false,
            error: null,
            orderData: null,
            submitCheckout: mockSubmitCheckout
        });

        // Mock de respuesta exitosa para submitCheckout
        mockSubmitCheckout.mockResolvedValue({
            success: true,
            orderId: 'ORDER123456'
        });
    });

    it('debería mostrar mensaje de carrito vacío cuando no hay items', () => {
        mockUseCart.mockReturnValue({
            cartItems: [],
            subtotal: 0,
            shipping: 0,
            tax: 0,
            total: 0,
            formatPrice: mockFormatPrice,
            clearCart: mockClearCart
        });

        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        expect(screen.getByText('No puedes realizar el checkout')).toBeInTheDocument();
        expect(screen.getByText('Tu carrito está vacío. Añade productos para continuar.')).toBeInTheDocument();
        expect(screen.getByText('Ir a la tienda')).toBeInTheDocument();
    });

    it('debería mostrar el formulario de checkout y el resumen del pedido cuando hay items en el carrito', () => {
        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        // Verificar título y secciones principales
        expect(screen.getByText('Finalizar Compra')).toBeInTheDocument();
        expect(screen.getByText('Datos de Envío')).toBeInTheDocument();
        expect(screen.getByText('Resumen del Pedido')).toBeInTheDocument();

        // Verificar campos del formulario
        expect(screen.getByLabelText('Nombre')).toBeInTheDocument();
        expect(screen.getByLabelText('Apellidos')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Teléfono')).toBeInTheDocument();
        expect(screen.getByLabelText('Dirección')).toBeInTheDocument();
        expect(screen.getByLabelText('Ciudad')).toBeInTheDocument();
        expect(screen.getByLabelText('Código Postal')).toBeInTheDocument();

        // Verificar botones
        expect(screen.getByText('Volver al carrito')).toBeInTheDocument();
        expect(screen.getByText('Finalizar pedido')).toBeInTheDocument();

        // Verificar items en el resumen
        expect(screen.getByText('Apple iPhone 12')).toBeInTheDocument();
        expect(screen.getByText('Color: Negro')).toBeInTheDocument();
        expect(screen.getByText('Almacenamiento: 64GB')).toBeInTheDocument();
        expect(screen.getByText('Cantidad: 2')).toBeInTheDocument();

        // Verificar totales - usamos getAllByText para textos duplicados
        expect(screen.getByText('Subtotal')).toBeInTheDocument();
        expect(screen.getAllByText('€1618.00')).toHaveLength(2);
        expect(screen.getByText('Impuestos (16%)')).toBeInTheDocument();
        expect(screen.getByText('€258.88')).toBeInTheDocument();
        expect(screen.getByText('Envío')).toBeInTheDocument();
        expect(screen.getByText('Gratis')).toBeInTheDocument();
        expect(screen.getByText('Total')).toBeInTheDocument();
        expect(screen.getByText('€1876.88')).toBeInTheDocument();
    });

    it('debería mostrar errores de validación cuando se envía el formulario vacío', async () => {
        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        // Enviar formulario sin completar campos
        const submitButton = screen.getByText('Finalizar pedido');
        fireEvent.click(submitButton);

        // Verificar mensajes de error
        await waitFor(() => {
            expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
            expect(screen.getByText('El apellido es obligatorio')).toBeInTheDocument();
            expect(screen.getByText('El email es obligatorio')).toBeInTheDocument();
            expect(screen.getByText('El teléfono es obligatorio')).toBeInTheDocument();
            expect(screen.getByText('La dirección es obligatoria')).toBeInTheDocument();
            expect(screen.getByText('La ciudad es obligatoria')).toBeInTheDocument();
            expect(screen.getByText('El código postal es obligatorio')).toBeInTheDocument();
        });

        // Verificar que no se llamó a submitCheckout
        expect(mockSubmitCheckout).not.toHaveBeenCalled();
    });

    it('debería validar el formato de email correctamente', async () => {
        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        // Enviar formulario con todos los campos excepto email para provocar validación de email
        fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText('Apellidos'), { target: { value: 'Pérez' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'correo-invalido' } });
        fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '612345678' } });
        fireEvent.change(screen.getByLabelText('Dirección'), { target: { value: 'Dirección test' } });
        fireEvent.change(screen.getByLabelText('Ciudad'), { target: { value: 'Madrid' } });
        fireEvent.change(screen.getByLabelText('Código Postal'), { target: { value: '28001' } });

        const submitButton = screen.getByText('Finalizar pedido');
        fireEvent.click(submitButton);

        // Verificamos que el email no fue validado correctamente
        await waitFor(() => {
            // Verificar que submitCheckout no se llamó porque el formulario no es válido
            expect(mockSubmitCheckout).not.toHaveBeenCalled();
        });
    });

    it('debería validar el formato de teléfono correctamente', async () => {
        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        // Completar campos mínimos para forzar solo el error de teléfono
        fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText('Apellidos'), { target: { value: 'Pérez' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '12345' } });
        fireEvent.change(screen.getByLabelText('Dirección'), { target: { value: 'Dirección test' } });
        fireEvent.change(screen.getByLabelText('Ciudad'), { target: { value: 'Madrid' } });
        fireEvent.change(screen.getByLabelText('Código Postal'), { target: { value: '28001' } });

        // Enviar formulario
        const submitButton = screen.getByText('Finalizar pedido');
        fireEvent.click(submitButton);

        // Verificar mensaje de error específico para teléfono
        await waitFor(() => {
            expect(screen.getByText('El teléfono debe tener al menos 9 dígitos')).toBeInTheDocument();
        });
    });

    it('debería validar el formato de código postal correctamente', async () => {
        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        // Completar campos mínimos para forzar solo el error de código postal
        fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText('Apellidos'), { target: { value: 'Pérez' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '612345678' } });
        fireEvent.change(screen.getByLabelText('Dirección'), { target: { value: 'Dirección test' } });
        fireEvent.change(screen.getByLabelText('Ciudad'), { target: { value: 'Madrid' } });
        fireEvent.change(screen.getByLabelText('Código Postal'), { target: { value: '123' } });

        // Enviar formulario
        const submitButton = screen.getByText('Finalizar pedido');
        fireEvent.click(submitButton);

        // Verificar mensaje de error específico para código postal
        await waitFor(() => {
            expect(screen.getByText('El código postal debe tener 5 dígitos')).toBeInTheDocument();
        });
    });

    it('debería enviar el formulario correctamente con datos válidos', async () => {
        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        // Completar formulario con datos válidos
        fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText('Apellidos'), { target: { value: 'Pérez' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '612345678' } });
        fireEvent.change(screen.getByLabelText('Dirección'), { target: { value: 'Calle Principal 123' } });
        fireEvent.change(screen.getByLabelText('Ciudad'), { target: { value: 'Madrid' } });
        fireEvent.change(screen.getByLabelText('Código Postal'), { target: { value: '28001' } });

        // Enviar formulario
        const submitButton = screen.getByText('Finalizar pedido');
        fireEvent.click(submitButton);

        // Verificar que se llamó a submitCheckout con los datos correctos
        await waitFor(() => {
            expect(mockSubmitCheckout).toHaveBeenCalledWith({
                firstName: 'Juan',
                lastName: 'Pérez',
                email: 'juan@example.com',
                phone: '612345678',
                address: 'Calle Principal 123',
                city: 'Madrid',
                zipCode: '28001'
            });
        });

        // Verificar redirección a la página de éxito
        expect(mockNavigate).toHaveBeenCalledWith('/checkout/success', {
            state: {
                orderId: 'ORDER123456',
                customerName: 'Juan Pérez'
            }
        });
    });

    it('debería mostrar mensaje de error cuando falla el checkout', async () => {
        // Configurar mock para simular error
        mockSubmitCheckout.mockResolvedValue({
            success: false,
            message: 'Error al procesar el pedido'
        });

        mockUseCheckout.mockReturnValue({
            isLoading: false,
            isSuccess: false,
            isError: true,
            error: new Error('Error al procesar el pedido'),
            orderData: null,
            submitCheckout: mockSubmitCheckout
        });

        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        // Completar formulario con datos válidos
        fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText('Apellidos'), { target: { value: 'Pérez' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '612345678' } });
        fireEvent.change(screen.getByLabelText('Dirección'), { target: { value: 'Calle Principal 123' } });
        fireEvent.change(screen.getByLabelText('Ciudad'), { target: { value: 'Madrid' } });
        fireEvent.change(screen.getByLabelText('Código Postal'), { target: { value: '28001' } });

        // Enviar formulario
        const submitButton = screen.getByText('Finalizar pedido');
        fireEvent.click(submitButton);

        // Verificar que se muestra el mensaje de error
        expect(screen.getByText('Se ha producido un error al procesar el pedido. Por favor, inténtalo de nuevo.')).toBeInTheDocument();
    });

    it('debería mostrar estado de carga durante el proceso de checkout', async () => {
        // Configurar mock para simular carga
        mockUseCheckout.mockReturnValue({
            isLoading: true,
            isSuccess: false,
            isError: false,
            error: null,
            orderData: null,
            submitCheckout: mockSubmitCheckout
        });

        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        // Verificar que el botón muestra "Procesando..."
        expect(screen.getByText('Procesando...')).toBeInTheDocument();
        expect(screen.getByText('Procesando...')).toBeDisabled();
    });

    it('debe limpiar un error específico cuando se modifica un campo con error', async () => {
        // Mock de cartItems con un producto
        mockUseCart.mockReturnValue({
            cartItems: [mockCartItem],
            totalPrice: 1618.00,
            cartCount: 1,
            formatPrice: mockFormatPrice,
            clearCart: mockClearCart
        });

        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        // Verificar que el formulario está visible
        expect(screen.getByText('Finalizar Compra')).toBeInTheDocument();

        // Enviar el formulario con el email vacío para generar error
        const submitButton = screen.getByText('Finalizar pedido');
        fireEvent.click(submitButton);

        // Verificar que aparece el error del email
        expect(screen.getByText('El email es obligatorio')).toBeInTheDocument();

        // Modificar el campo de email
        const emailInput = screen.getByLabelText('Email');
        fireEvent.change(emailInput, { target: { value: 'correo@ejemplo.com' } });

        // Verificar que el error ha desaparecido
        expect(screen.queryByText('El email es obligatorio')).not.toBeInTheDocument();
    });

    it('no debe enviar el formulario si hay errores de validación', async () => {
        // Mock de cartItems con un producto
        mockUseCart.mockReturnValue({
            cartItems: [mockCartItem],
            totalPrice: 1618.00,
            cartCount: 1,
            formatPrice: mockFormatPrice,
            clearCart: mockClearCart
        });

        render(
            <MemoryRouter>
                <CheckoutPage />
            </MemoryRouter>
        );

        // Verificar que el formulario está visible
        expect(screen.getByText('Finalizar Compra')).toBeInTheDocument();

        // Enviar el formulario sin completar ningún campo
        const submitButton = screen.getByText('Finalizar pedido');
        fireEvent.click(submitButton);

        // Verificar que aparecen varios errores
        expect(screen.getByText('El nombre es obligatorio')).toBeInTheDocument();
        expect(screen.getByText('El apellido es obligatorio')).toBeInTheDocument();
        expect(screen.getByText('El email es obligatorio')).toBeInTheDocument();

        // Verificar que submitCheckout no fue llamado
        expect(mockSubmitCheckout).not.toHaveBeenCalled();
    });
}); 