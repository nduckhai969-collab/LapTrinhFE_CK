import { Settings, Users } from 'lucide-react';
import type { Conversation } from '../../types/conversation.types';

export interface ChatHeaderProps {
  conversation?: Conversation;
  onOpenDetail?: () => void;
}

const ChatHeader = ({ conversation, onOpenDetail }: ChatHeaderProps) => {
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
  const partner = conversation.participants[0];
  const isPeerOnline = partner !== undefined && partner.status === 'online';

  const handleOpenDetail = () => {
    if (onOpenDetail !== undefined) {
      onOpenDetail();
    }
  };

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
        {!isRoom && (
          <span className="chat-status">
            <span className={isPeerOnline ? 'status-dot' : 'status-dot status-dot-offline'} />
            {isPeerOnline ? 'Đang hoạt động' : 'Không hoạt động'}
          </span>
        )}
      </div>
      <button
        type="button"
        className="chat-settings-button"
        onClick={handleOpenDetail}
        title="Quản lý đoạn chat"
      >
        <Settings size={20} />
      </button>
    </header>
  );
};

export default ChatHeader;
