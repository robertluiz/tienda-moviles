import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ProductListPage from '../../pages/ProductListPage/ProductListPage';
import { Product } from '../../services/api';

// Mock del hook useProductList
const mockLoadMore = vi.fn();
const mockRefetch = vi.fn();

// Crear un mock específico para useProductList
const mockUseProductList = vi.fn();
vi.mock('../../hooks/useProductList', () => ({
    default: () => mockUseProductList()
}));

// Mock de los componentes
vi.mock('../../components/ProductCard/ProductCard', () => ({
    default: ({ product }: { product: Product }) => (
        <div data-testid="product-card" data-product-id={product.id}>
            {product.brand} {product.model}
        </div>
    )
}));

vi.mock('../../components/Layout/Layout', () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mock-layout">{children}</div>
    )
}));

vi.mock('../../components/SearchBar/SearchBar', () => ({
    default: ({ onSearch }: { onSearch: (term: string) => void }) => (
        <div data-testid="mock-search-bar">
            <input
                data-testid="search-input"
                onChange={(e) => onSearch(e.target.value)}
            />
            <button data-testid="search-button" onClick={() => onSearch('test')}>
                Buscar
            </button>
        </div>
    )
}));

vi.mock('../../components/ProductListSkeleton/ProductListSkeleton', () => ({
    default: () => <div data-testid="product-list-skeleton">Cargando...</div>
}));

// Mock para IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Productos de ejemplo para las pruebas
const mockProducts: Product[] = [
    {
        id: '1',
        brand: 'Apple',
        model: 'iPhone 12',
        price: '809',
        imgUrl: '/images/iphone12.jpg',
        options: { colors: [], storages: [] }
    },
    {
        id: '2',
        brand: 'Samsung',
        model: 'Galaxy S21',
        price: '799',
        imgUrl: '/images/galaxys21.jpg',
        options: { colors: [], storages: [] }
    },
    {
        id: '3',
        brand: 'Xiaomi',
        model: 'Mi 11',
        price: '699',
        imgUrl: '/images/mi11.jpg',
        options: { colors: [], storages: [] }
    }
];

describe('ProductListPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Configurar el comportamiento predeterminado del mock
        mockUseProductList.mockReturnValue({
            products: mockProducts,
            filteredTotal: mockProducts.length,
            isLoading: false,
            isLoadingMore: false,
            error: null,
            refetch: mockRefetch,
            loadMore: mockLoadMore,
            hasMore: true,
            currentPage: 1
        });
    });

    it('debería renderizar la página con el título correcto', () => {
        render(<ProductListPage />);

        const title = screen.getByText('Todos los Productos');
        expect(title).toBeInTheDocument();
    });

    it('debería renderizar la barra de búsqueda', () => {
        render(<ProductListPage />);

        const searchBar = screen.getByTestId('mock-search-bar');
        expect(searchBar).toBeInTheDocument();
    });

    it('debería renderizar tarjetas de productos cuando hay datos', () => {
        render(<ProductListPage />);

        const productCards = screen.getAllByTestId('product-card');
        expect(productCards).toHaveLength(3);
    });

    it('debería mostrar el skeleton loader cuando está cargando', () => {
        mockUseProductList.mockReturnValue({
            products: [],
            filteredTotal: 0,
            isLoading: true,
            isLoadingMore: false,
            error: null,
            refetch: mockRefetch,
            loadMore: mockLoadMore,
            hasMore: false,
            currentPage: 1
        });

        render(<ProductListPage />);

        const skeleton = screen.getByTestId('product-list-skeleton');
        expect(skeleton).toBeInTheDocument();
    });

    it('debería mostrar mensaje de error cuando hay un error', () => {
        mockUseProductList.mockReturnValue({
            products: [],
            filteredTotal: 0,
            isLoading: false,
            isLoadingMore: false,
            error: new Error('Error de carga'),
            refetch: mockRefetch,
            loadMore: mockLoadMore,
            hasMore: false,
            currentPage: 1
        });

        render(<ProductListPage />);

        const errorMessage = screen.getByText('Se ha producido un error al cargar los productos.');
        expect(errorMessage).toBeInTheDocument();

        const reloadButton = screen.getByText('Intentar de nuevo');
        expect(reloadButton).toBeInTheDocument();
    });

    it('debería mostrar mensaje cuando no hay productos', () => {
        mockUseProductList.mockReturnValue({
            products: [],
            filteredTotal: 0,
            isLoading: false,
            isLoadingMore: false,
            error: null,
            refetch: mockRefetch,
            loadMore: mockLoadMore,
            hasMore: false,
            currentPage: 1
        });

        render(<ProductListPage />);

        const emptyMessage = screen.getByText('No se han encontrado productos.');
        expect(emptyMessage).toBeInTheDocument();
    });

    it('debería cambiar el título al realizar una búsqueda', () => {
        render(<ProductListPage />);

        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'iPhone' } });

        const newTitle = screen.getByText('Resultados para: iPhone');
        expect(newTitle).toBeInTheDocument();
    });

    it('debería llamar a loadMore al hacer clic en el botón de cargar más', () => {
        render(<ProductListPage />);

        const loadMoreButton = screen.getByText('Cargar más productos');
        fireEvent.click(loadMoreButton);

        expect(mockLoadMore).toHaveBeenCalledTimes(1);
    });

    it('debería mostrar contador de productos', () => {
        render(<ProductListPage />);

        const counter = screen.getByText('Mostrando 3 de 3 productos (Página 1)');
        expect(counter).toBeInTheDocument();
    });

    it('debería llamar a refetch al hacer clic en el botón de recargar cuando hay error', () => {
        mockUseProductList.mockReturnValue({
            products: [],
            filteredTotal: 0,
            isLoading: false,
            isLoadingMore: false,
            error: new Error('Error de carga'),
            refetch: mockRefetch,
            loadMore: mockLoadMore,
            hasMore: false,
            currentPage: 1
        });

        render(<ProductListPage />);

        const reloadButton = screen.getByText('Intentar de nuevo');
        fireEvent.click(reloadButton);

        expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('debería llamar a loadMore cuando el observador de intersección detecta que el elemento es visible', async () => {
        render(<ProductListPage />);

        // Obtener la función callback pasada al IntersectionObserver
        const [observerCallback] = mockIntersectionObserver.mock.calls[0];

        // Simular que el elemento observado es visible
        observerCallback([
            {
                isIntersecting: true,
                target: document.createElement('div')
            }
        ]);

        // Verificar que se llamó a loadMore
        expect(mockLoadMore).toHaveBeenCalledTimes(1);
    });

    it('no debería llamar a loadMore cuando el observador detecta un elemento no visible', async () => {
        render(<ProductListPage />);

        // Obtener la función callback pasada al IntersectionObserver
        const [observerCallback] = mockIntersectionObserver.mock.calls[0];

        // Simular que el elemento observado no es visible
        observerCallback([
            {
                isIntersecting: false,
                target: document.createElement('div')
            }
        ]);

        // Verificar que no se llamó a loadMore
        expect(mockLoadMore).not.toHaveBeenCalled();
    });

    it('no debería llamar a loadMore cuando no hay más elementos para cargar', async () => {
        // Configurar para que no haya más elementos
        mockUseProductList.mockReturnValue({
            products: mockProducts,
            filteredTotal: mockProducts.length,
            isLoading: false,
            isLoadingMore: false,
            error: null,
            refetch: mockRefetch,
            loadMore: mockLoadMore,
            hasMore: false,
            currentPage: 1
        });

        render(<ProductListPage />);

        // Obtener la función callback pasada al IntersectionObserver
        const [observerCallback] = mockIntersectionObserver.mock.calls[0];

        // Simular que el elemento observado es visible
        observerCallback([
            {
                isIntersecting: true,
                target: document.createElement('div')
            }
        ]);

        // Verificar que no se llamó a loadMore
        expect(mockLoadMore).not.toHaveBeenCalled();
    });

    it('no debería llamar a loadMore cuando está cargando', async () => {
        // Configurar para que esté cargando
        mockUseProductList.mockReturnValue({
            products: mockProducts,
            filteredTotal: mockProducts.length,
            isLoading: true,
            isLoadingMore: false,
            error: null,
            refetch: mockRefetch,
            loadMore: mockLoadMore,
            hasMore: true,
            currentPage: 1
        });

        render(<ProductListPage />);

        // Obtener la función callback pasada al IntersectionObserver
        const [observerCallback] = mockIntersectionObserver.mock.calls[0];

        // Simular que el elemento observado es visible
        observerCallback([
            {
                isIntersecting: true,
                target: document.createElement('div')
            }
        ]);

        // Verificar que no se llamó a loadMore
        expect(mockLoadMore).not.toHaveBeenCalled();
    });
}); 