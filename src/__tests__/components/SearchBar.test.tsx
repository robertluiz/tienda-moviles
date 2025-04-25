import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import SearchBar from '../../components/SearchBar/SearchBar';

describe('SearchBar', () => {
    it('debería renderizar correctamente con placeholder por defecto', () => {
        const mockSearch = vi.fn();
        render(<SearchBar onSearch={mockSearch} />);

        const input = screen.getByPlaceholderText('Buscar productos...');
        expect(input).toBeInTheDocument();

        // Verificar que el botón de búsqueda esté presente usando una consulta más específica
        const searchButton = screen.getByRole('button', { name: 'Buscar' });
        expect(searchButton).toBeInTheDocument();

        // Verificar que el botón de limpiar no esté presente inicialmente
        const clearButton = screen.queryByLabelText('Limpiar búsqueda');
        expect(clearButton).not.toBeInTheDocument();
    });

    it('debería renderizar con placeholder personalizado', () => {
        const mockSearch = vi.fn();
        render(<SearchBar onSearch={mockSearch} placeholder="Buscar dispositivos..." />);

        const input = screen.getByPlaceholderText('Buscar dispositivos...');
        expect(input).toBeInTheDocument();
    });

    it('debería actualizar el valor de entrada al escribir', () => {
        const mockSearch = vi.fn();
        render(<SearchBar onSearch={mockSearch} />);

        const input = screen.getByPlaceholderText('Buscar productos...') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'iPhone' } });

        expect(input.value).toBe('iPhone');
    });

    it('debería llamar a onSearch al escribir en el input', () => {
        const mockSearch = vi.fn();
        render(<SearchBar onSearch={mockSearch} />);

        const input = screen.getByPlaceholderText('Buscar productos...');
        fireEvent.change(input, { target: { value: 'iPhone' } });

        expect(mockSearch).toHaveBeenCalledWith('iPhone');
    });

    it('debería llamar a onSearch al enviar el formulario', () => {
        const mockSearch = vi.fn();
        render(<SearchBar onSearch={mockSearch} />);

        const input = screen.getByPlaceholderText('Buscar productos...');
        fireEvent.change(input, { target: { value: 'Samsung' } });

        // Obtener el formulario directamente por su clase
        const form = document.querySelector('.search-form');
        expect(form).toBeInTheDocument();

        // Enviar el formulario
        fireEvent.submit(form as HTMLFormElement);

        expect(mockSearch).toHaveBeenCalledWith('Samsung');
    });

    it('debería mostrar y ocultar el botón de limpiar según el estado', () => {
        const mockSearch = vi.fn();
        render(<SearchBar onSearch={mockSearch} />);

        const input = screen.getByPlaceholderText('Buscar productos...');

        // Inicialmente no hay botón de limpiar
        expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument();

        // Escribir en el input para que aparezca el botón
        fireEvent.change(input, { target: { value: 'iPhone' } });
        const clearButton = screen.getByLabelText('Limpiar búsqueda');
        expect(clearButton).toBeInTheDocument();

        // Limpiar el input para que desaparezca el botón
        fireEvent.click(clearButton);
        expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument();
    });

    it('debería limpiar el input y llamar a onSearch con valor vacío al hacer clic en limpiar', () => {
        const mockSearch = vi.fn();
        render(<SearchBar onSearch={mockSearch} />);

        const input = screen.getByPlaceholderText('Buscar productos...') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'iPhone' } });

        // Reset mock para tener llamadas claras
        mockSearch.mockReset();

        const clearButton = screen.getByLabelText('Limpiar búsqueda');
        fireEvent.click(clearButton);

        expect(input.value).toBe('');
        expect(mockSearch).toHaveBeenCalledWith('');
    });
}); 