import type { Message } from './message.types';
import type { User } from './user.types';

export type ConversationType = 'direct' | 'group';

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;
  avatar?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  adminIds?: string[];
  createdBy?: string;
  isPinned?: boolean;
  isMuted?: boolean;
  createdAt?: string;
  updatedAt: string;
}

export interface CreateConversationPayload {
  type: ConversationType;
  participantIds: string[];
  name?: string;
  avatar?: string;
}

export interface UpdateConversationPayload {
  name?: string;
  avatar?: string;
  isPinned?: boolean;
  isMuted?: boolean;
}
