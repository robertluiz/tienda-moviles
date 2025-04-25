import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProductLoadingCard from '../../components/ProductLoadingCard/ProductLoadingCard';

describe('ProductLoadingCard', () => {
    it('renderiza correctamente con la estructura esperada', () => {
        const { container } = render(<ProductLoadingCard />);

        // Verificar que el contenedor principal tiene la clase correcta
        expect(container.firstChild).toHaveClass('product-loading-card');

        // Verificar que contiene un contenedor de imagen
        const imageContainer = container.querySelector('.loading-image-container');
        expect(imageContainer).toBeInTheDocument();

        // Verificar que contiene el elemento de imagen
        expect(imageContainer?.querySelector('.loading-image')).toBeInTheDocument();

        // Verificar que contiene la sección de contenido
        const contentSection = container.querySelector('.loading-content');
        expect(contentSection).toBeInTheDocument();

        // Verificar que contiene los elementos de información
        expect(container.querySelector('.loading-brand')).toBeInTheDocument();
        expect(container.querySelector('.loading-model')).toBeInTheDocument();
        expect(container.querySelector('.loading-price')).toBeInTheDocument();
    });

    it('no contiene texto visible', () => {
        const { container } = render(<ProductLoadingCard />);

        // El componente de carga no debe tener contenido de texto visible
        expect(container.textContent).toBe('');
    });
}); 