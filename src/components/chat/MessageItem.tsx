import type { Message } from '../../types/message.types';

export interface MessageItemProps {
  message: Message;
  isOwnMessage?: boolean;
  senderName?: string;
}

const formatMessageTime = (createdAt: string): string => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const MessageItem = ({ message, isOwnMessage, senderName }: MessageItemProps) => {
  const isOwn = isOwnMessage === true;
  const rowClassName = isOwn ? 'message-row message-row-own' : 'message-row';

  let avatarText = '?';
  if (senderName !== undefined && senderName.length > 0) {
    avatarText = senderName.charAt(0);
  }

  return (
    <div className={rowClassName}>
      {!isOwn && <span className="message-avatar">{avatarText}</span>}
      <div className="message-body">
        {!isOwn && senderName !== undefined && <span className="message-sender">{senderName}</span>}
        <div className="message-bubble">
          <span className="message-content">{message.content}</span>
        </div>
        <span className="message-time">{formatMessageTime(message.createdAt)}</span>
      </div>
    </div>
  );
};

export default MessageItem;
