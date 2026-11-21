import type { Contact } from '../../types/contact.types';
import ContactItem from './ContactItem';
export interface ContactListProps {
  contacts?: Contact[];
  onSelectContact?: (id: string) => void;
}
const ContactList = ({
                       contacts = [],
                       onSelectContact,
                     }: ContactListProps) => {
  if (contacts.length === 0) {
    return (
        <div className="contact-empty">
          <p>Chưa có liên hệ nào.</p>
        </div>
    );
  }
  return (
      <div className="contact-list">
        {contacts.map((contact) => (
            <ContactItem
                key={contact.id}
                contact={contact}
                onSelect={onSelectContact}
            />
        ))}
      </div>
  );
};
export default ContactList;