import type { Notification } from '../../types/notification.types';

export interface NotificationListProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
}

const NotificationList = (_props: NotificationListProps) => {
  return null;
};

export default NotificationList;
