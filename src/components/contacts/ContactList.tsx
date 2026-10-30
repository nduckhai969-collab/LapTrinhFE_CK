import type { Contact } from '../../types/contact.types';

export interface ContactListProps {
  contacts?: Contact[];
  onSelectContact?: (id: string) => void;
}

const ContactList = (_props: ContactListProps) => {
  return null;
};

export default ContactList;
