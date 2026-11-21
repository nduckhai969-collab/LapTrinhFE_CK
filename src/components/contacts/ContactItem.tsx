import type { Contact } from '../../types/contact.types';
import Avatar from '../common/Avatar';
export interface ContactItemProps {
  contact: Contact;
  onSelect?: (id: string) => void;
}
const ContactItem = ({ contact, onSelect }: ContactItemProps) => {
  const user = contact.user;
  if (!user) {
    return null;
  }
  return (
      <div
          className="contact-item"
          onClick={() => onSelect?.(contact.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSelect?.(contact.id);
            }
          }}
      >
        <Avatar
            src={user.avatar}
            name={user.fullName}
            status={user.status}
        />
        <div className="contact-info">
          <h3>{contact.nickname || user.fullName}</h3>
          <p>{user.email}</p>
        </div>
        <span className={`contact-status contact-status-${user.status}`}>
        {user.status === 'online' ? 'Đang hoạt động' : 'Ngoại tuyến'}
      </span>
      </div>
  );
};
export default ContactItem;