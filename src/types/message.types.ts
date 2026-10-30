export type MessageType = 'text' | 'image' | 'file' | 'audio' | 'video';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: MessageType;
  createdAt: string;
  status: MessageStatus;
}
