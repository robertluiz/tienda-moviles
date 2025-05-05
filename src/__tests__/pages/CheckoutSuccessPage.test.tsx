import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CheckoutSuccessPage from '../../pages/CheckoutSuccessPage/CheckoutSuccessPage';

// Mock useLocation para probar diferentes estados
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: vi.fn(),
    };
});

// Mock del componente Layout
vi.mock('../../components/Layout/Layout', () => ({
    default: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-layout">{children}</div>
}));

import { useLocation } from 'react-router-dom';

describe('CheckoutSuccessPage', () => {
    it('renderiza correctamente con información de pedido cuando hay estado', () => {
        // Mockear useLocation con estado
        (useLocation as unknown as Mock).mockReturnValue({
            state: {
                orderId: '123456',
                customerName: 'Juan Pérez'
            }
        });

        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CheckoutSuccessPage />
            </BrowserRouter>
        );

        // Verificar que se muestra la información correcta
        expect(screen.getByText('¡Pedido Completado!')).toBeInTheDocument();
        expect(screen.getByText(/Gracias,/)).toBeInTheDocument();
        expect(screen.getByText(/Juan Pérez/)).toBeInTheDocument();
        expect(screen.getByText(/Tu número de pedido es:/)).toBeInTheDocument();
        expect(screen.getByText(/123456/)).toBeInTheDocument();

        // Verificar elementos adicionales
        expect(screen.getByText('¿Qué sigue?')).toBeInTheDocument();
        expect(screen.getByText('Recibirás un email de confirmación en breve')).toBeInTheDocument();
        expect(screen.getByText('Volver a la tienda')).toBeInTheDocument();
    });

    it('renderiza con valores por defecto cuando no hay estado', () => {
        // Mockear useLocation sin estado
        (useLocation as unknown as Mock).mockReturnValue({
            state: null
        });

        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CheckoutSuccessPage />
            </BrowserRouter>
        );

        // Verificar que se muestra la información con valores por defecto
        expect(screen.getByText('¡Pedido Completado!')).toBeInTheDocument();
        expect(screen.getByText(/Gracias,/)).toBeInTheDocument();
        expect(screen.getByText(/Cliente/)).toBeInTheDocument(); // Valor por defecto
        expect(screen.getByText(/Tu número de pedido es:/)).toBeInTheDocument();
        expect(screen.getByText(/N\/A/)).toBeInTheDocument(); // Valor por defecto
    });

    it('contiene un enlace funcional para volver a la tienda', () => {
        // Mockear useLocation sin estado
        (useLocation as unknown as Mock).mockReturnValue({
            state: null
        });

        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <CheckoutSuccessPage />
            </BrowserRouter>
        );

        // Verificar que el enlace existe y tiene la URL correcta
        const link = screen.getByText('Volver a la tienda');
        expect(link).toBeInTheDocument();
        expect(link.tagName).toBe('A');
        expect(link).toHaveAttribute('href', '/');
    });
}); 