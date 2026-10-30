import type { Contact } from '../../types/contact.types';

export interface ContactItemProps {
  contact: Contact;
  onSelect?: (id: string) => void;
}

const ContactItem = (_props: ContactItemProps) => {
  return null;
};

export default ContactItem;
