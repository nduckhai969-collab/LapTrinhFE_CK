import type { Notification } from '../../types/notification.types';

export interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

const NotificationItem = (_props: NotificationItemProps) => {
  return null;
};

export default NotificationItem;
