import type { Conversation } from '../../types/conversation.types';

export interface ChatDetailPanelProps {
  conversation?: Conversation;
  isOpen?: boolean;
  onClose?: () => void;
}

const ChatDetailPanel = (_props: ChatDetailPanelProps) => {
  return null;
};

export default ChatDetailPanel;
