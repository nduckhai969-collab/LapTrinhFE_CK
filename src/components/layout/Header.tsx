import { User } from 'lucide-react';
import viteLogo from '../../assets/vite.svg';
import { mockCurrentUser } from '../../data/mockData';
import { getAuthSession } from '../../services/authSevices';

export interface HeaderProps {
  title?: string;
  onToggleSidebar?: () => void;
}

const Header = () => {
  const session = getAuthSession();
  const displayName = session?.username ?? mockCurrentUser.fullName;
  const isUserOnline = session !== null || mockCurrentUser.status === 'online';
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
            <span className="username">{displayName}</span>
            <span className="status">
              <span className={statusDotClass}></span>
              {statusText}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
