import type { User } from '../types/user.types';
import type { Conversation } from '../types/conversation.types';
import type { Message } from '../types/message.types';
import type { Contact } from '../types/contact.types';
import type { Notification } from '../types/notification.types';

export const mockUsers: User[] = [
  {
    id: 'user-02',
    fullName: 'Trần Thị B',
    email: 'tranthib@vitechat.com',
    status: 'online',
  },
  {
    id: 'user-03',
    fullName: 'Lê Văn C',
    email: 'levanc@vitechat.com',
    status: 'offline',
  },
  {
    id: 'user-04',
    fullName: 'Phạm Thị D',
    email: 'phamthid@vitechat.com',
    status: 'busy',
  },
  {
    id: 'user-05',
    fullName: 'Hoàng Văn E',
    email: 'hoangvane@vitechat.com',
    status: 'away',
  },
];

export const mockMessages: Message[] = [
  {
    id: 'message-01',
    conversationId: 'conversation-01',
    senderId: 'user-02',
    content: 'Chào bạn, bạn đã làm xong giao diện chưa?',
    type: 'text',
    status: 'read',
    createdAt: '2026-11-08T09:00:00',
  },
  {
    id: 'message-02',
    conversationId: 'conversation-01',
    senderId: 'user-01',
    content: 'Mình đang làm phần danh sách hội thoại.',
    type: 'text',
    status: 'read',
    createdAt: '2026-11-08T09:05:00',
  },
  {
    id: 'message-03',
    conversationId: 'conversation-01',
    senderId: 'user-02',
    content: 'Ok, xong nhớ gửi mình xem nhé.',
    type: 'text',
    status: 'read',
    createdAt: '2026-11-08T09:10:00',
  },
  {
    id: 'message-04',
    conversationId: 'conversation-02',
    senderId: 'user-03',
    content: 'Mọi người họp nhóm lúc 8 giờ tối nay nhé.',
    type: 'text',
    status: 'read',
    createdAt: '2026-11-08T10:00:00',
  },
  {
    id: 'message-05',
    conversationId: 'conversation-02',
    senderId: 'user-04',
    content: 'Mình đồng ý.',
    type: 'text',
    status: 'read',
    createdAt: '2026-11-08T10:02:00',
  },
  {
    id: 'message-06',
    conversationId: 'conversation-03',
    senderId: 'user-03',
    content: 'Gửi mình xin tài liệu với.',
    type: 'text',
    status: 'read',
    createdAt: '2026-11-08T11:00:00',
  },
  {
    id: 'message-07',
    conversationId: 'conversation-03',
    senderId: 'user-01',
    content: 'Để mình gửi sau nhé.',
    type: 'text',
    status: 'read',
    createdAt: '2026-11-08T11:15:00',
  },
  {
    id: 'message-08',
    conversationId: 'conversation-04',
    senderId: 'user-05',
    content: 'Tối nay cả nhà ăn cơm cùng nhé.',
    type: 'text',
    status: 'read',
    createdAt: '2026-11-08T12:00:00',
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conversation-01',
    type: 'direct',
    name: 'Trần Thị B',
    participants: [mockUsers[0]],
    lastMessage: mockMessages[2],
    unreadCount: 2,
    updatedAt: '2026-11-08T09:10:00',
  },
  {
    id: 'conversation-02',
    type: 'group',
    name: 'Nhóm Đồ Án',
    participants: [mockUsers[1], mockUsers[2], mockUsers[3]],
    lastMessage: mockMessages[4],
    unreadCount: 0,
    updatedAt: '2026-11-08T10:02:00',
  },
  {
    id: 'conversation-03',
    type: 'direct',
    name: 'Lê Văn C',
    participants: [mockUsers[1]],
    lastMessage: mockMessages[6],
    unreadCount: 1,
    updatedAt: '2026-11-08T11:15:00',
  },
  {
    id: 'conversation-04',
    type: 'group',
    name: 'Gia đình',
    participants: [mockUsers[3]],
    lastMessage: mockMessages[7],
    unreadCount: 0,
    updatedAt: '2026-11-08T12:00:00',
  },
];

export const mockContacts: Contact[] = [];
export const mockNotifications: Notification[] = [];

export const mockCurrentUser: User = {
  id: 'user-01',
  fullName: 'Nguyễn Văn A',
  email: 'nguyenvana@vitechat.com',
  status: 'online',
};
