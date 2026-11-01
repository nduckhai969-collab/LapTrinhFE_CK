import type { User } from './user.types';

export type FriendRequestStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

export interface Contact {
  id: string;
  userId: string;
  contactUserId: string;
  nickname?: string;
  createdAt: string;
  user?: User;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: FriendRequestStatus;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

export interface SendFriendRequestPayload {
  receiverEmailOrId: string;
  message?: string;
}
