import type { Message } from './message.types';
import type { User } from './user.types';

export type ConversationType = 'direct' | 'group';

export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  updatedAt: string;
  unreadCount: number;
  type?: ConversationType;
  name?: string;
  avatar?: string;
}
