import type { Conversation } from '../../types/conversation.types';

export interface ConversationListProps {
  conversations?: Conversation[];
  activeId?: string;
  onSelectConversation?: (id: string) => void;
}

const ConversationList = (_props: ConversationListProps) => {
  return null;
};

export default ConversationList;
