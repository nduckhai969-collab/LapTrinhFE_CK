import type { Message } from './message.types';
import type { UserStatus } from './user.types';

export interface TypingPayload {
  conversationId: string;
  userId: string;
  userName?: string;
  isTyping: boolean;
}

export interface UserStatusPayload {
  userId: string;
  status: UserStatus;
  lastSeen?: string;
}

export interface MessageReadPayload {
  conversationId: string;
  messageId: string;
  userId: string;
  readAt: string;
}

export interface SocketEventsMap {
  // Client to Server
  'chat:send_message': (payload: { conversationId: string; content: string }) => void;
  'chat:typing': (payload: TypingPayload) => void;
  'chat:mark_as_read': (payload: { conversationId: string; messageId: string }) => void;
  'user:change_status': (payload: { status: UserStatus }) => void;

  // Server to Client
  'chat:new_message': (message: Message) => void;
  'chat:user_typing': (payload: TypingPayload) => void;
  'chat:message_read': (payload: MessageReadPayload) => void;
  'user:status_changed': (payload: UserStatusPayload) => void;
}

