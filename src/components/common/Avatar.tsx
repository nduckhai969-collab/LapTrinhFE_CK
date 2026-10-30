import type { UserStatus } from '../../types/user.types';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'small' | 'medium' | 'large';
  status?: UserStatus;
  className?: string;
}

const Avatar = (_props: AvatarProps) => {
  return null;
};

export default Avatar;
