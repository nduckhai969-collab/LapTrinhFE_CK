import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Conversation, CreateConversationPayload, Message, User } from '../../types';
import SearchInput from '../../components/common/SearchInput';
import ConversationList from '../../components/chat/ConversationList';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageList from '../../components/chat/MessageList';
import MessageInput from '../../components/chat/MessageInput';
import CreateRoomModal from '../../components/chat/CreateRoomModal';
import { mockConversations, mockMessages, mockUsers, mockCurrentUser } from '../../data/mockData';
import './chat.css';

const senderNames: Record<string, string> = { [mockCurrentUser.id]: mockCurrentUser.fullName };
mockUsers.forEach((user) => {
  senderNames[user.id] = user.fullName;
});

const ChatPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);

  let selectedConversation: Conversation | null = null;
  for (let i = 0; i < conversations.length; i++) {
    const currentConversation = conversations[i];
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

  const handleCreateRoom = (payload: CreateConversationPayload) => {
    const participants: User[] = [];
    payload.participantIds.forEach((id) => {
      const user = mockUsers.find((item) => item.id === id);
      if (user !== undefined) {
        participants.push(user);
      }
    });

    let roomName = payload.name;
    if (payload.type === 'direct' && participants.length > 0) {
      roomName = participants[0].fullName;
    }
    if (roomName === undefined || roomName === '') {
      roomName = 'Phòng mới';
    }

    const newConversation: Conversation = {
      id: `conversation-${Date.now()}`,
      type: payload.type,
      name: roomName,
      participants,
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setConversations((prevConversations) => [newConversation, ...prevConversations]);
    setSelectedConversationId(newConversation.id);
  };

  return (
    <div className="chat-page">
      <aside className="conversation-panel">
        <div className="conversation-toolbar">
          <SearchInput className="conversation-search" placeholder="Tìm kiếm cuộc trò chuyện" />
          <button
            type="button"
            className="create-room-button"
            onClick={() => setIsCreateRoomOpen(true)}
            title="Tạo phòng chat"
          >
            <Plus size={24} />
          </button>
        </div>
        <ConversationList
          conversations={conversations}
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

      <CreateRoomModal
        isOpen={isCreateRoomOpen}
        users={mockUsers}
        onClose={() => setIsCreateRoomOpen(false)}
        onCreate={handleCreateRoom}
      />
    </div>
  );
};

export default ChatPage;
