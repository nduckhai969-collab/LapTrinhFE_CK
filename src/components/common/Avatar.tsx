import type { UserStatus } from '../../types/user.types';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'small' | 'medium' | 'large';
  status?: UserStatus;
  className?: string;
}

const Avatar = ({
                  src,
                  name,
                  size = 'medium',
                  status,
                  className = '',
                }: AvatarProps) => {
  const initial = name.trim().charAt(0).toUpperCase() || '?';

  return (
      <div className={`avatar avatar-${size} ${className}`}>
        {src ? (
            <img src={src} alt={name} className="avatar-image" />
        ) : (
            <span className="avatar-initial">{initial}</span>
        )}

        {status && (
            <span className={`avatar-status avatar-status-${status}`} />
        )}
      </div>
  );
};

export default Avatar;