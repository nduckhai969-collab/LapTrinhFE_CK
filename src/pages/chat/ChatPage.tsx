import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Conversation, CreateConversationPayload, Message, User } from '../../types';
import SearchInput from '../../components/common/SearchInput';
import ConversationList from '../../components/chat/ConversationList';
import ChatHeader from '../../components/chat/ChatHeader';
import MessageList from '../../components/chat/MessageList';
import MessageInput from '../../components/chat/MessageInput';
import CreateRoomModal from '../../components/chat/CreateRoomModal';
import ChatDetailPanel from '../../components/chat/ChatDetailPanel';
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
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

  const handleRenameConversation = (id: string, name: string) => {
    setConversations((prevConversations) =>
      prevConversations.map((conversation) => {
        if (conversation.id === id) {
          return { ...conversation, name, updatedAt: new Date().toISOString() };
        }
        return conversation;
      }),
    );
  };

  const handleDeleteConversation = (id: string) => {
    setConversations((prevConversations) =>
      prevConversations.filter((conversation) => conversation.id !== id),
    );
    if (selectedConversationId === id) {
      setSelectedConversationId(null);
    }
    setIsDetailOpen(false);
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
            <ChatHeader
              conversation={selectedConversation}
              onOpenDetail={() => setIsDetailOpen(true)}
            />
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

      <ChatDetailPanel
        key={selectedConversationId === null ? 'none' : selectedConversationId}
        conversation={selectedConversation === null ? undefined : selectedConversation}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onRename={handleRenameConversation}
        onDelete={handleDeleteConversation}
      />
    </div>
  );
};

export default ChatPage;
