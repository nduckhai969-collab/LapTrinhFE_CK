import type { Conversation } from '../../types/conversation.types';

export interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onSelect?: (id: string) => void;
}

const ConversationItem = (_props: ConversationItemProps) => {
  return null;
};

export default ConversationItem;
