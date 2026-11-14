import { useEffect, useRef } from 'react';
import type { Message } from '../../types/message.types';
import MessageItem from './MessageItem';

export interface MessageListProps {
  messages?: Message[];
  currentUserId?: string;
  senderNames?: Record<string, string>;
}

const MessageList = ({ messages, currentUserId, senderNames }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messageCount = messages === undefined ? 0 : messages.length;

  useEffect(() => {
    if (bottomRef.current !== null) {
      bottomRef.current.scrollIntoView({ block: 'end' });
    }
  }, [messageCount]);

  if (messages === undefined || messages.length === 0) {
    return <div className="message-empty">Chưa có tin nhắn nào</div>;
  }

  return (
    <div className="message-list">
      {messages.map((message) => {
        let senderName: string | undefined = undefined;
        if (senderNames !== undefined) {
          senderName = senderNames[message.senderId];
        }

        return (
          <MessageItem
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === currentUserId}
            senderName={senderName}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
