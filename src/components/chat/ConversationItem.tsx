import type { Conversation } from '../../types/conversation.types';

export interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onSelect?: (id: string) => void;
}

const ConversationItem = ({ conversation, isActive, onSelect }: ConversationItemProps) => {
  const itemClassName = isActive ? 'conversation-item active' : 'conversation-item';

  let displayName = conversation.name;
  if (displayName === undefined) {
    displayName = 'Cuộc hội thoại';
  }

  let lastMessageText = '';
  if (conversation.lastMessage !== undefined) {
    lastMessageText = conversation.lastMessage.content;
  }

  const onClickConversation = () => {
    if (onSelect !== undefined) {
      onSelect(conversation.id);
    }
  };

  return (
    <div className={itemClassName} onClick={onClickConversation}>
      <span className="conversation-avatar">{displayName.charAt(0)}</span>
      <div className="conversation-info">
        <span className="conversation-name">{displayName}</span>
        <span className="conversation-last-message">{lastMessageText}</span>
      </div>
    </div>
  );
};

export default ConversationItem;
