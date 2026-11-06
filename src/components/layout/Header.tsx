import { Settings, User } from 'lucide-react';
import viteLogo from '../../assets/vite.svg';
import { mockCurrentUser } from '../../data/mockData';

export interface HeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
}

const Header = () => {
  const isUserOnline = mockCurrentUser.status === 'online';
  const statusText = isUserOnline ? 'Đang hoạt động' : 'Không hoạt động';
  const statusDotClass = isUserOnline ? 'status-dot' : 'status-dot status-dot-offline';

  return (
    <header className="top-bar">
      <div className="brand">
        <img src={viteLogo} alt="ViteChat" className="logo"/>
        <span className="brand-name">ViteChat</span>
      </div>

      <div className="account">
        <div className="user">
          <span className="avatar">
            <User size={20} />
          </span>
          <span className="user-info">
            <span className="username">{mockCurrentUser.fullName}</span>
            <span className="status">
              <span className={statusDotClass}></span>
              {statusText}
            </span>
          </span>
        </div>

        <button type="button" className="settings-button" title="Cài đặt">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
