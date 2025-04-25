import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductListSkeleton from '../../components/ProductListSkeleton/ProductListSkeleton';

describe('ProductListSkeleton', () => {
    it('renderiza correctamente con la estructura esperada', () => {
        const { container } = render(<ProductListSkeleton />);

        // Verificar que el contenedor principal tiene la clase correcta
        expect(container.firstChild).toHaveClass('skeleton-grid');
    });

    it('renderiza el número correcto de tarjetas de esqueleto (8)', () => {
        const { container } = render(<ProductListSkeleton />);

        // Verificar que hay 8 tarjetas de esqueleto
        const skeletonCards = container.querySelectorAll('.skeleton-card');
        expect(skeletonCards.length).toBe(8);

        // Verificar que cada tarjeta tiene los elementos esperados
        skeletonCards.forEach(card => {
            expect(card.querySelector('.skeleton-image')).toBeInTheDocument();
            expect(card.querySelector('.skeleton-content')).toBeInTheDocument();
            expect(card.querySelector('.skeleton-title')).toBeInTheDocument();
            expect(card.querySelector('.skeleton-subtitle')).toBeInTheDocument();
            expect(card.querySelector('.skeleton-price')).toBeInTheDocument();
        });
    });

    it('no contiene texto visible', () => {
        const { container } = render(<ProductListSkeleton />);

        // El esqueleto no debe tener contenido de texto visible
        expect(container.textContent).toBe('');
    });
}); 