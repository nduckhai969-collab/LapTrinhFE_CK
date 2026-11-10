import type { Conversation } from '../../types/conversation.types';
import ConversationItem from './ConversationItem';

export interface ConversationListProps {
  conversations?: Conversation[];
  activeId?: string;
  onSelectConversation?: (id: string) => void;
}

const ConversationList = ({ conversations, activeId, onSelectConversation }: ConversationListProps) => {
  if (conversations === undefined || conversations.length === 0) {
    return <div className="conversation-empty">Chưa có cuộc hội thoại</div>;
  }

  return (
    <div className="conversation-list">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={conversation.id === activeId}
          onSelect={onSelectConversation}
        />
      ))}
    </div>
  );
};

export default ConversationList;
