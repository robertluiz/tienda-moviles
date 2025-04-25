import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductCardSkeleton from '../../components/ProductCard/ProductCardSkeleton';

describe('ProductCardSkeleton', () => {
    it('renderiza correctamente con las clases CSS esperadas', () => {
        const { container } = render(<ProductCardSkeleton />);

        // Verificar que el contenedor principal tiene la clase correcta
        expect(container.firstChild).toHaveClass('product-card-skeleton');

        // Verificar que contiene un contenedor de imagen
        const imageContainer = container.querySelector('.skeleton-image-container');
        expect(imageContainer).toBeInTheDocument();

        // Verificar que contiene la sección de información
        const infoSection = container.querySelector('.skeleton-info');
        expect(infoSection).toBeInTheDocument();

        // Verificar que contiene los elementos de información
        expect(container.querySelector('.skeleton-brand')).toBeInTheDocument();
        expect(container.querySelector('.skeleton-model')).toBeInTheDocument();
        expect(container.querySelector('.skeleton-rating')).toBeInTheDocument();
        expect(container.querySelector('.skeleton-price')).toBeInTheDocument();
    });

    it('no contiene texto visible', () => {
        const { container } = render(<ProductCardSkeleton />);

        // El esqueleto no debe tener contenido de texto visible
        expect(container.textContent).toBe('');
    });
}); 