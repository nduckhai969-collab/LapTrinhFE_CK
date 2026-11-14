import { Users } from 'lucide-react';
import type { Conversation } from '../../types/conversation.types';

export interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onSelect?: (id: string) => void;
}

const ConversationItem = ({ conversation, isActive, onSelect }: ConversationItemProps) => {
  const itemClassName = isActive ? 'conversation-item active' : 'conversation-item';
  const isRoom = conversation.type === 'group';

  let displayName = conversation.name;
  if (displayName === undefined) {
    displayName = isRoom ? 'Phòng chat' : 'Cuộc hội thoại';
  }

  let lastMessageText = '';
  if (conversation.lastMessage !== undefined) {
    lastMessageText = conversation.lastMessage.content;
  }

  const avatarClassName = isRoom ? 'conversation-avatar room-avatar' : 'conversation-avatar';
  const avatarText = isRoom ? '#' : displayName.charAt(0);
  const memberCount = conversation.participants.length;

  const onClickConversation = () => {
    if (onSelect !== undefined) {
      onSelect(conversation.id);
    }
  };

  return (
    <div className={itemClassName} onClick={onClickConversation}>
      <span className={avatarClassName}>{avatarText}</span>
      <div className="conversation-info">
        <div className="conversation-name-row">
          <span className="conversation-name">{displayName}</span>
          {isRoom && (
            <span className="conversation-members" title={`${memberCount} thành viên`}>
              <Users size={12} />
              {memberCount}
            </span>
          )}
        </div>
        <span className="conversation-last-message">{lastMessageText}</span>
      </div>
    </div>
  );
};

export default ConversationItem;
