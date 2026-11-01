export type MessageType = 'text' | 'image' | 'file' | 'audio' | 'video' | 'system';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageAttachment {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  userIds: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  createdAt: string;
  updatedAt?: string;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
  replyToId?: string;
  replyTo?: Message;
  isEdited?: boolean;
  isDeleted?: boolean;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  type?: MessageType;
  replyToId?: string;
  attachments?: File[];
}
