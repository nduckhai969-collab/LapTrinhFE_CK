import type { Conversation } from '../../types/conversation.types';

export interface ChatHeaderProps {
  conversation?: Conversation;
  onOpenDetail?: () => void;
}

const ChatHeader = (_props: ChatHeaderProps) => {
  return null;
};

export default ChatHeader;
