export type NotificationType = 'message' | 'friend_request' | 'system' | 'mention';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  content: string;
  isRead: boolean;
  createdAt: string;
}
