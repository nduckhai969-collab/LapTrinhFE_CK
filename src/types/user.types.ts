export type UserStatus = 'online' | 'offline' | 'away' | 'busy';

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
  status: UserStatus;
  createdAt?: string;
}
