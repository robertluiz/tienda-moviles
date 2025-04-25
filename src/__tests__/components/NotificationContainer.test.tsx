import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NotificationContainer from '../../components/Notification/NotificationContainer';
import { NotificationItem } from '../../components/Notification/NotificationContainer';

// Mock del componente Notification
vi.mock('../../components/Notification/Notification', () => ({
    default: ({ type, message, onClose }: { type: string; message: string; onClose: () => void }) => (
        <div
            data-testid={`notification-${type}`}
            onClick={onClose}
            className={`notification notification-${type}`}
        >
            {message}
        </div>
    )
}));

describe('NotificationContainer', () => {
    const mockNotifications: NotificationItem[] = [
        { id: '1', type: 'success', message: 'Operación exitosa' },
        { id: '2', type: 'error', message: 'Ha ocurrido un error' },
        { id: '3', type: 'info', message: 'Información importante' }
    ];

    it('renderiza múltiples notificaciones correctamente', () => {
        const onRemoveMock = vi.fn();

        render(
            <NotificationContainer
                notifications={mockNotifications}
                onRemove={onRemoveMock}
            />
        );

        // Verificar que se renderizan todas las notificaciones
        expect(screen.getByTestId('notification-success')).toBeInTheDocument();
        expect(screen.getByTestId('notification-error')).toBeInTheDocument();
        expect(screen.getByTestId('notification-info')).toBeInTheDocument();

        // Verificar los mensajes
        expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
        expect(screen.getByText('Ha ocurrido un error')).toBeInTheDocument();
        expect(screen.getByText('Información importante')).toBeInTheDocument();
    });

    it('llama a onRemove cuando se cierra una notificación', () => {
        const onRemoveMock = vi.fn();

        render(
            <NotificationContainer
                notifications={mockNotifications}
                onRemove={onRemoveMock}
            />
        );

        // Hacer clic en la primera notificación para simular el cierre
        screen.getByTestId('notification-success').click();

        // Verificar que se llamó a onRemove con el id correcto
        expect(onRemoveMock).toHaveBeenCalledWith('1');

        // Hacer clic en la segunda notificación
        screen.getByTestId('notification-error').click();

        // Verificar que se llamó a onRemove de nuevo con el id correcto
        expect(onRemoveMock).toHaveBeenCalledWith('2');
    });

    it('no renderiza nada cuando no hay notificaciones', () => {
        const onRemoveMock = vi.fn();
        const { container } = render(
            <NotificationContainer
                notifications={[]}
                onRemove={onRemoveMock}
            />
        );

        // Verificar que el container está vacío excepto por el div principal
        expect(container.firstChild).toHaveClass('notification-container');
        expect(container.firstChild?.childNodes.length).toBe(0);
    });
}); 