import { Users } from 'lucide-react';
import type { Conversation } from '../../types/conversation.types';

export interface ChatHeaderProps {
  conversation?: Conversation;
  onOpenDetail?: () => void;
}

const ChatHeader = ({ conversation }: ChatHeaderProps) => {
  if (conversation === undefined) {
    return null;
  }

  const isRoom = conversation.type === 'group';

  let displayName = conversation.name;
  if (displayName === undefined) {
    displayName = isRoom ? 'Phòng chat' : 'Cuộc hội thoại';
  }

  const avatarClassName = isRoom ? 'chat-avatar room-avatar' : 'chat-avatar';
  const avatarText = isRoom ? '#' : displayName.charAt(0);
  const memberCount = conversation.participants.length;

  return (
    <header className="chat-header">
      <span className={avatarClassName}>{avatarText}</span>
      <div className="chat-title">
        <span className="chat-name">{displayName}</span>
        {isRoom && (
          <span className="chat-members">
            <Users size={12} />
            {memberCount} thành viên
          </span>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;
