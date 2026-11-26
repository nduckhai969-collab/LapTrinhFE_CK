import { Trash2 } from 'lucide-react';
import type { Contact } from '../../types/contact.types';
import type { UserStatus } from '../../types/user.types';
import Avatar from '../common/Avatar';

export interface ContactItemProps {
  contact: Contact;
  isOnline?: boolean | null;
  onRemove?: (id: string) => void;
}

const ContactItem = ({ contact, isOnline, onRemove }: ContactItemProps) => {
  const username = contact.contactUserId;
  const displayName = contact.nickname?.trim() || contact.user?.fullName || username;
  const avatarStatus: UserStatus | undefined = isOnline === undefined || isOnline === null
    ? undefined
    : isOnline ? 'online' : 'offline';

  let statusText = 'Chưa kiểm tra';
  let statusClass = 'unknown';
  if (isOnline === true) {
    statusText = 'Đang hoạt động';
    statusClass = 'online';
  } else if (isOnline === false) {
    statusText = 'Ngoại tuyến';
    statusClass = 'offline';
  }

  return (
    <article className="contact-item">
      <Avatar
        src={contact.user?.avatar}
        name={displayName}
        status={avatarStatus}
        className="contact-avatar"
      />

      <div className="contact-info">
        <h3>{displayName}</h3>
        <p className="contact-username">@{username}</p>
      </div>

      <span className={`contact-status contact-status-${statusClass}`}>
        <span className="contact-status-dot" />
        {statusText}
      </span>

      <button
        type="button"
        className="contact-remove-button"
        onClick={() => onRemove?.(contact.id)}
        aria-label={`Xóa ${displayName} khỏi danh bạ`}
        title="Xóa liên hệ"
      >
        <Trash2 size={17} />
      </button>
    </article>
  );
};

export default ContactItem;
