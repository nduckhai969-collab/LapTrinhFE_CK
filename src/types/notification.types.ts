export type NotificationType = 'message' | 'friend_request' | 'system' | 'mention';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title?: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  data?: {
    conversationId?: string;
    senderId?: string;
    friendRequestId?: string;
    [key: string]: unknown;
  };
}
