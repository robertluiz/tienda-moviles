import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Notification from '../../components/Notification/Notification';

describe('Notification', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renderiza una notificación de tipo success correctamente', () => {
        render(
            <Notification
                type="success"
                message="Operación exitosa"
            />
        );

        expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
        const notification = screen.getByText('Operación exitosa').closest('.notification');
        expect(notification).toHaveClass('notification-success');
    });

    it('renderiza una notificación de tipo error correctamente', () => {
        render(
            <Notification
                type="error"
                message="Ha ocurrido un error"
            />
        );

        expect(screen.getByText('Ha ocurrido un error')).toBeInTheDocument();
        const notification = screen.getByText('Ha ocurrido un error').closest('.notification');
        expect(notification).toHaveClass('notification-error');
    });

    it('renderiza una notificación de tipo info correctamente', () => {
        render(
            <Notification
                type="info"
                message="Información importante"
            />
        );

        expect(screen.getByText('Información importante')).toBeInTheDocument();
        const notification = screen.getByText('Información importante').closest('.notification');
        expect(notification).toHaveClass('notification-info');
    });

    it('se cierra automáticamente después del tiempo especificado', async () => {
        const onCloseMock = vi.fn();

        render(
            <Notification
                type="success"
                message="Auto close test"
                duration={2000}
                onClose={onCloseMock}
            />
        );

        // Verificar que la notificación está visible
        expect(screen.getByText('Auto close test')).toBeInTheDocument();

        // Avanzar el tiempo para que se cierre la notificación
        act(() => {
            vi.advanceTimersByTime(2000);
        });

        // La animación de salida dura 300ms
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Verificar que se llamó a onClose
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('se cierra manualmente al hacer clic en el botón de cerrar', () => {
        const onCloseMock = vi.fn();

        render(
            <Notification
                type="info"
                message="Manual close test"
                onClose={onCloseMock}
            />
        );

        // Verificar que la notificación está visible
        expect(screen.getByText('Manual close test')).toBeInTheDocument();

        // Hacer clic en el botón de cerrar
        const closeButton = screen.getByRole('button', { name: '' });
        fireEvent.click(closeButton);

        // La animación de salida dura 300ms
        act(() => {
            vi.advanceTimersByTime(300);
        });

        // Verificar que se llamó a onClose
        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('maneja un tipo de notificación desconocido correctamente', () => {
        // Usar any para poder pasar un tipo no válido
        render(
            <Notification
                type={'unknown' as any}
                message="Notificación con tipo desconocido"
            />
        );

        expect(screen.getByText('Notificación con tipo desconocido')).toBeInTheDocument();

        // Verificar que no hay ícono
        const notificationContent = screen.getByText('Notificación con tipo desconocido').closest('.notification-content');
        const iconContainer = notificationContent?.querySelector('.notification-icon');
        expect(iconContainer).toBeInTheDocument();
        expect(iconContainer?.childElementCount).toBe(0);
    });
}); 