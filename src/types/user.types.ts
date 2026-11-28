export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  status: UserStatus;
  lastSeen?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type UserSummary = Pick<User, 'id' | 'fullName' | 'avatar' | 'status'>;

export interface AuthAccount {
  id: string;
  fullName: string;
  email: string;
  password: string;
  avatar?: string;
  status: UserStatus;
  createdAt?: string;
}

export interface UpdateUserProfilePayload {
  fullName?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  status?: UserStatus;
}
