import { useState } from 'react';
import type { Conversation, Message } from '../../types';
import SearchInput from '../../components/common/SearchInput';
import ConversationList from '../../components/chat/ConversationList';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageList from '../../components/chat/MessageList';
import MessageInput from '../../components/chat/MessageInput';
import { mockConversations, mockMessages, mockUsers, mockCurrentUser } from '../../data/mockData';
import './chat.css';

const senderNames: Record<string, string> = { [mockCurrentUser.id]: mockCurrentUser.fullName };
mockUsers.forEach((user) => {
  senderNames[user.id] = user.fullName;
});

const ChatPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

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

  const conversationMessages = messages.filter(
    (message) => message.conversationId === selectedConversationId,
  );

  const handleSendMessage = (content: string) => {
    if (selectedConversationId === null) {
      return;
    }
    const newMessage: Message = {
      id: `message-${Date.now()}`,
      conversationId: selectedConversationId,
      senderId: mockCurrentUser.id,
      content,
      type: 'text',
      status: 'sent',
      createdAt: new Date().toISOString(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

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
          <>
            <ChatHeader conversation={selectedConversation} />
            <MessageList
              messages={conversationMessages}
              currentUserId={mockCurrentUser.id}
              senderNames={senderNames}
            />
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="chat-placeholder">Chọn một cuộc hội thoại để bắt đầu</div>
        )}
      </section>
    </div>
  );
};

export default ChatPage;
