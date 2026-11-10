import type { Conversation } from '../../types/conversation.types';

export interface ChatHeaderProps {
  conversation?: Conversation;
  onOpenDetail?: () => void;
}

const ChatHeader = ({ conversation }: ChatHeaderProps) => {
  if (conversation === undefined) {
    return null;
  }

  let displayName = conversation.name;
  if (displayName === undefined) {
    displayName = 'Cuộc hội thoại';
  }

  return (
    <header className="chat-header">
      <span className="chat-avatar">{displayName.charAt(0)}</span>
      <span className="chat-name">{displayName}</span>
    </header>
  );
};

export default ChatHeader;
