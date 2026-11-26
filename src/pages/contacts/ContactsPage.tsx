import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { UserRoundPlus, Users } from 'lucide-react';
import ContactList from '../../components/contacts/ContactList';
import SearchInput from '../../components/common/SearchInput';
import type { Contact } from '../../types/contact.types';
import { checkUserExists, checkUserOnline } from '../../services/contactService';
import { getAuthSession } from '../../services/authSevices';

const STORAGE_PREFIX = 'connectchat_contacts:';

const readContacts = (storageKey: string | null): Contact[] => {
  if (storageKey === null) {
    return [];
  }

  try {
    const storedValue = localStorage.getItem(storageKey);
    if (storedValue === null) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((item): item is Contact =>
      typeof item === 'object'
      && item !== null
      && 'id' in item
      && typeof item.id === 'string'
      && 'contactUserId' in item
      && typeof item.contactUserId === 'string'
      && 'createdAt' in item
      && typeof item.createdAt === 'string',
    );
  } catch {
    return [];
  }
};

const ContactsPage = () => {
  const session = getAuthSession();
  const storageKey = session === null
    ? null
    : `${STORAGE_PREFIX}${session.username.toLowerCase()}`;
  const [contacts, setContacts] = useState<Contact[]>(() => readContacts(storageKey));
  const [searchValue, setSearchValue] = useState('');
  const [usernameToAdd, setUsernameToAdd] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [pendingUsername, setPendingUsername] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [onlineByUsername, setOnlineByUsername] = useState<Record<string, boolean | null>>({});

  useEffect(() => {
    let isCurrent = true;

    const refreshStatuses = async () => {
      const nextStatuses: Record<string, boolean | null> = {};

      for (const contact of contacts) {
        const username = contact.contactUserId;
        const key = username.toLowerCase();
        if (isCurrent) {
          setOnlineByUsername((current) => ({ ...current, [key]: null }));
        }

        try {
          nextStatuses[key] = await checkUserOnline(username);
        } catch {
          nextStatuses[key] = null;
        }

        if (isCurrent) {
          setOnlineByUsername((current) => ({ ...current, [key]: nextStatuses[key] }));
        }
      }
    };

    void refreshStatuses();
    return () => {
      isCurrent = false;
    };
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    if (keyword === '') {
      return contacts;
    }

    return contacts.filter((contact) => {
      const displayName = contact.nickname ?? contact.user?.fullName ?? '';
      return displayName.toLowerCase().includes(keyword)
        || contact.contactUserId.toLowerCase().includes(keyword);
    });
  }, [contacts, searchValue]);

  const saveContacts = (nextContacts: Contact[]) => {
    if (storageKey === null) {
      setError('Bạn cần đăng nhập để sử dụng danh bạ.');
      return false;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(nextContacts));
      setContacts(nextContacts);
      return true;
    } catch {
      setError('Không thể lưu danh bạ trên trình duyệt này.');
      return false;
    }
  };

  const handleSearchUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setPendingUsername(null);

    const username = usernameToAdd.trim();
    if (storageKey === null || session === null) {
      setError('Bạn cần đăng nhập để sử dụng danh bạ.');
      return;
    }
    if (!/^[A-Za-z0-9_]+$/.test(username)) {
      setError('Tên đăng nhập chỉ được chứa chữ cái, chữ số và dấu gạch dưới.');
      return;
    }
    if (username.toLowerCase() === session.username.toLowerCase()) {
      setError('Bạn không thể thêm chính mình vào danh bạ.');
      return;
    }
    if (contacts.some((contact) =>
      contact.contactUserId.toLowerCase() === username.toLowerCase(),
    )) {
      setError('Tài khoản này đã có trong danh bạ.');
      return;
    }

    setIsChecking(true);
    try {
      const exists = await checkUserExists(username);
      if (!exists) {
        setError('Không tìm thấy tài khoản này.');
        return;
      }

      setPendingUsername(username);
    } catch (addError) {
      setError(
        addError instanceof Error
          ? addError.message
          : 'Không kiểm tra được tài khoản. Vui lòng thử lại.',
      );
    } finally {
      setIsChecking(false);
    }
  };

  const handleConfirmAddContact = () => {
    if (pendingUsername === null || session === null) {
      return;
    }

    const username = pendingUsername.trim();
    if (contacts.some((contact) =>
      contact.contactUserId.toLowerCase() === username.toLowerCase(),
    )) {
      setError('Tài khoản này đã có trong danh bạ.');
      setPendingUsername(null);
      return;
    }

    const newContact: Contact = {
      id: `contact-${username.toLowerCase()}`,
      userId: session.username,
      contactUserId: username,
      nickname: username,
      createdAt: new Date().toISOString(),
      user: {
        id: username,
        fullName: username,
        email: '',
        status: 'offline',
      },
    };

    if (saveContacts([newContact, ...contacts])) {
      setUsernameToAdd('');
      setPendingUsername(null);
      setError('');
      setNotice(`Đã thêm @${username} vào danh bạ trên thiết bị này.`);
    }
  };

  const handleCancelAddContact = () => {
    setPendingUsername(null);
    setNotice('');
  };

  const handleRemoveContact = (id: string) => {
    setError('');
    setNotice('');
    const removedContact = contacts.find((contact) => contact.id === id);
    const nextContacts = contacts.filter((contact) => contact.id !== id);

    if (saveContacts(nextContacts) && removedContact !== undefined) {
      setNotice(`Đã xóa @${removedContact.contactUserId} khỏi danh bạ trên thiết bị này.`);
    }
  };

  return (
    <main className="contacts-page">
      <header className="contacts-header">
        <div>
          <span className="contacts-eyebrow">KẾT NỐI</span>
          <h1>Danh bạ</h1>
          <p>Tìm và quản lý những người bạn muốn trò chuyện cùng.</p>
        </div>
        <div className="contacts-count" aria-label={`${contacts.length} liên hệ`}>
          <Users size={17} />
          <span>{contacts.length} liên hệ</span>
        </div>
      </header>

      <section className="contacts-add-card" aria-labelledby="contacts-add-title">
        <div className="contacts-add-heading">
          <span className="contacts-add-icon"><UserRoundPlus size={20} /></span>
          <div>
            <h2 id="contacts-add-title">Thêm liên hệ</h2>
            <p>Nhập đúng tên đăng nhập của tài khoản cần tìm.</p>
          </div>
        </div>

        <form className="contacts-add-form" onSubmit={handleSearchUser}>
          <label className="visually-hidden" htmlFor="contact-username">
            Tên đăng nhập
          </label>
          <input
            id="contact-username"
            value={usernameToAdd}
            onChange={(event) => {
              setUsernameToAdd(event.target.value);
              setPendingUsername(null);
              setError('');
              setNotice('');
            }}
            placeholder="Ví dụ: ten_dang_nhap"
            autoComplete="off"
            disabled={isChecking || session === null}
          />
          <button type="submit" disabled={isChecking || session === null}>
            {isChecking ? 'Đang tìm...' : 'Tìm người dùng'}
          </button>
        </form>
        <p className="contacts-storage-note">
          Danh bạ hiện được lưu trên trình duyệt này.
        </p>

        {pendingUsername !== null && (
          <div className="contact-search-result" role="status">
            <div className="contact-search-result-info">
              <span className="contact-search-result-avatar" aria-hidden="true">
                {pendingUsername.charAt(0).toUpperCase()}
              </span>
              <div>
                <strong>@{pendingUsername}</strong>
                <p>Tìm thấy tài khoản. Bạn có muốn thêm vào danh bạ không?</p>
              </div>
            </div>
            <div className="contact-search-result-actions">
              <button
                type="button"
                className="contact-confirm-add"
                onClick={handleConfirmAddContact}
              >
                Thêm vào danh bạ
              </button>
              <button
                type="button"
                className="contact-cancel-add"
                onClick={handleCancelAddContact}
              >
                Không thêm
              </button>
            </div>
          </div>
        )}
      </section>

      {session === null && (
        <p className="contacts-alert contacts-alert-error" role="alert">
          Bạn cần đăng nhập để sử dụng danh bạ.
        </p>
      )}
      {error && <p className="contacts-alert contacts-alert-error" role="alert">{error}</p>}
      {notice && <p className="contacts-alert contacts-alert-success" role="status">{notice}</p>}

      <section className="contacts-list-section" aria-labelledby="contacts-list-title">
        <div className="contacts-list-heading">
          <div>
            <h2 id="contacts-list-title">Liên hệ của bạn</h2>
            <p>{searchValue ? `${filteredContacts.length} kết quả` : 'Trạng thái được kiểm tra từ máy chủ.'}</p>
          </div>
          <SearchInput
            className="contacts-search"
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Tìm theo tên đăng nhập..."
          />
        </div>

        <div className="contacts-content">
          <ContactList
            contacts={filteredContacts}
            onlineByUsername={onlineByUsername}
            emptyMessage={contacts.length > 0
              ? 'Không có liên hệ nào khớp với nội dung tìm kiếm.'
              : undefined}
            onRemoveContact={handleRemoveContact}
          />
        </div>
      </section>
    </main>
  );
};

export default ContactsPage;
