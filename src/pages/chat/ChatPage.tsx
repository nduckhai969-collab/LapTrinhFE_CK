import { useState } from 'react';
import type { Conversation } from '../../types';
import SearchInput from '../../components/common/SearchInput';
import ConversationList from '../../components/chat/ConversationList';
import ChatHeader from '../../components/chat/ChatHeader';
import { mockConversations } from '../../data/mockData';
import './chat.css';

const ChatPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  let selectedConversation: Conversation | null = null;
  for (let i = 0; i < mockConversations.length; i++) {
    const currentConversation = mockConversations[i];
    if (currentConversation.id === selectedConversationId) {
      selectedConversation = currentConversation;
    }
  }

  let activeConversationId: string | undefined = undefined;
  if (selectedConversationId !== null) {
    activeConversationId = selectedConversationId;
  }

  return (
    <div className="chat-page">
      <aside className="conversation-panel">
        <SearchInput className="conversation-search" placeholder="Tìm kiếm cuộc trò chuyện" />
        <ConversationList
          conversations={mockConversations}
          activeId={activeConversationId}
          onSelectConversation={setSelectedConversationId}
        />
      </aside>

      <section className="chat-area">
        {selectedConversation !== null ? (
          <ChatHeader conversation={selectedConversation} />
        ) : (
          <div className="chat-placeholder">Chọn một cuộc hội thoại để bắt đầu</div>
        )}
      </section>
    </div>
  );
};

export default ChatPage;
