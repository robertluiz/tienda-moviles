import { useState, useCallback } from 'react';
import { NotificationItem } from '../components/Notification/NotificationContainer';
import { NotificationType } from '../components/Notification/Notification';

const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((type: NotificationType, message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, type, message }]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showSuccess = useCallback((message: string) => {
    return addNotification('success', message);
  }, [addNotification]);

  const showError = useCallback((message: string) => {
    return addNotification('error', message);
  }, [addNotification]);

  const showInfo = useCallback((message: string) => {
    return addNotification('info', message);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo
  };
};

export default useNotifications; 