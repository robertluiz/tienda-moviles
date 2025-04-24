import { useEffect, useState } from 'react';
import Notification, { NotificationType } from './Notification';
import './Notification.css';

export interface NotificationItem {
    id: string;
    type: NotificationType;
    message: string;
}

interface NotificationContainerProps {
    notifications: NotificationItem[];
    onRemove: (id: string) => void;
}

const NotificationContainer = ({
    notifications,
    onRemove
}: NotificationContainerProps) => {
    return (
        <div className="notification-container">
            {notifications.map(notification => (
                <Notification
                    key={notification.id}
                    type={notification.type}
                    message={notification.message}
                    onClose={() => onRemove(notification.id)}
                />
            ))}
        </div>
    );
};

export default NotificationContainer; 