import { Users } from 'lucide-react';
import type { Conversation } from '../../types/conversation.types';
import { useUserOnlineStatus } from '../../hooks/useUserOnlineStatus';

export interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onSelect?: (id: string) => void;
}

const ConversationItem = ({ conversation, isActive, onSelect }: ConversationItemProps) => {
  const isUserOnline = useUserOnlineStatus(conversation.name);
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
  const isOnline = !isRoom && isUserOnline;
  const unreadCount = conversation.unreadCount;
  const unreadText = unreadCount > 99 ? '99+' : String(unreadCount);

  const onClickConversation = () => {
    if (onSelect !== undefined) {
      onSelect(conversation.id);
    }
  };

  return (
    <div className={itemClassName} onClick={onClickConversation}>
      <span className="conversation-avatar-wrapper">
        <span className={avatarClassName}>{avatarText}</span>
        {!isRoom && (
          <span
            className={
              isOnline ? 'avatar-status-dot' : 'avatar-status-dot avatar-status-dot-offline'
            }
            title={isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
          />
        )}
      </span>
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
      {unreadCount > 0 && (
        <span className="conversation-unread" aria-label={`${unreadCount} tin nhắn chưa đọc`}>
          {unreadText}
        </span>
      )}
    </div>
  );
};

export default ConversationItem;
