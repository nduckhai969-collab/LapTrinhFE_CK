import type { User } from './user.types';

export interface Contact {
  id: string;
  userId: string;
  contactUserId: string;
  nickname?: string;
  createdAt: string;
  user?: User;
}
