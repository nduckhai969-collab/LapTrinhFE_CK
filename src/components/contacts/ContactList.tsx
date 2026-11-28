import type { Contact } from '../../types/contact.types';
import ContactItem from './ContactItem';

export interface ContactListProps {
  contacts?: Contact[];
  onlineByUsername?: Record<string, boolean | null>;
  emptyMessage?: string;
  onOpenContact?: (username: string) => void;
  onRemoveContact?: (id: string) => void;
}

const ContactList = ({
  contacts = [],
  onlineByUsername = {},
  emptyMessage = 'Thêm một tài khoản bằng tên đăng nhập để bắt đầu.',
  onOpenContact,
  onRemoveContact,
}: ContactListProps) => {
  if (contacts.length === 0) {
    return (
      <div className="contact-empty">
        <span className="contact-empty-icon" aria-hidden="true">◎</span>
        <h2>Danh bạ đang trống</h2>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        <ContactItem
          key={contact.id}
          contact={contact}
          isOnline={onlineByUsername[contact.contactUserId.toLowerCase()]}
          onOpenChat={onOpenContact}
          onRemove={onRemoveContact}
        />
      ))}
    </div>
  );
};

export default ContactList;
