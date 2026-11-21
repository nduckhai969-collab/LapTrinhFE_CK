import { useMemo, useState } from 'react';
import type { Contact } from '../../types/contact.types';
import ContactList from '../../components/contacts/ContactList';
import SearchInput from '../../components/common/SearchInput';
const mockContacts: Contact[] = [
  {
    id: '1',
    userId: 'current-user',
    contactUserId: 'user-1',
    nickname: 'An',
    createdAt: '2026-11-21',
    user: {
      id: 'user-1',
      fullName: 'Nguyễn Văn An',
      email: 'an@gmail.com',
      status: 'online',
    },
  },
  {
    id: '2',
    userId: 'current-user',
    contactUserId: 'user-2',
    nickname: 'Bình',
    createdAt: '2026-11-21',
    user: {
      id: 'user-2',
      fullName: 'Trần Văn Bình',
      email: 'binh@gmail.com',
      status: 'offline',
    },
  },
  {
    id: '3',
    userId: 'current-user',
    contactUserId: 'user-3',
    nickname: 'Chi',
    createdAt: '2026-11-21',
    user: {
      id: 'user-3',
      fullName: 'Lê Thị Chi',
      email: 'chi@gmail.com',
      status: 'away',
    },
  },
];

const ContactsPage = () => {
  const [contacts] = useState<Contact[]>(mockContacts);
  const [searchValue, setSearchValue] = useState('');
  const filteredContacts = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    if (!keyword) {
      return contacts;
    }
    return contacts.filter((contact) => {
      const name = contact.nickname || contact.user?.fullName || '';
      const email = contact.user?.email || '';
      return (
          name.toLowerCase().includes(keyword) ||
          email.toLowerCase().includes(keyword)
      );
    });
  }, [contacts, searchValue]);
  const handleSelectContact = (id: string) => {
    const selectedContact = contacts.find(
        (contact) => contact.id === id,
    );
    if (selectedContact) {
      console.log('Liên hệ được chọn:', selectedContact);
      alert(`Bạn đã chọn ${selectedContact.user?.fullName}`);
    }
  };
  return (
      <div className="contacts-page">
        <div className="contacts-header">
          <div>
            <h1>Danh bạ</h1>
            <p>Quản lý danh sách liên hệ của bạn</p>
          </div>
          <span className="contacts-count">
          {contacts.length} liên hệ
        </span>
        </div>
        <div className="contacts-toolbar">
          <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Tìm kiếm theo tên hoặc email..."
          />
        </div>
        <div className="contacts-content">
          <ContactList
              contacts={filteredContacts}
              onSelectContact={handleSelectContact}
          />
        </div>
      </div>
  );
};

export default ContactsPage;