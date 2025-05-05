import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { describe, it, expect, vi } from 'vitest';

// Mock del componente Header
vi.mock('../../components/Header/Header', () => ({
    default: () => <div data-testid="mock-header">Header Mockado</div>
}));

describe('Layout', () => {
    it('renderiza el Header y el contenido hijo', () => {
        render(
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Layout>
                    <div data-testid="test-content">Contenido de prueba</div>
                </Layout>
            </BrowserRouter>
        );

        // Verificar que se renderiza el Header
        expect(screen.getByTestId('mock-header')).toBeInTheDocument();

        // Verificar que se renderiza el contenido hijo
        expect(screen.getByTestId('test-content')).toBeInTheDocument();
        expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();

        // Verificar clases CSS
        const container = screen.getByTestId('test-content').closest('.page-container');
        expect(container).toBeInTheDocument();
        expect(container?.querySelector('.main-content')).toBeInTheDocument();
        expect(container?.querySelector('.container')).toBeInTheDocument();
    });
}); 