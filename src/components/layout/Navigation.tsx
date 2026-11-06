import { NavLink } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  Bell,
  Settings,
  User,
  LogOut,
} from 'lucide-react';
import { ROUTE_PATHS } from '../../routes/routePaths';

export interface NavigationProps {
  currentPath?: string;
  unreadMessagesCount?: number;
  unreadNotificationsCount?: number;
}

const Navigation = ({
  unreadMessagesCount = 2,
  unreadNotificationsCount = 3,
}: NavigationProps) => {
  const mainNavItems = [
    {
      to: ROUTE_PATHS.CHAT,
      icon: MessageSquare,
      label: 'Tin nhắn',
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
    },
    {
      to: ROUTE_PATHS.CONTACTS,
      icon: Users,
      label: 'Danh bạ',
      badge: null,
    },
    {
      to: ROUTE_PATHS.NOTIFICATIONS,
      icon: Bell,
      label: 'Thông báo',
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
    },
  ];

  const bottomNavItems = [
    {
      to: ROUTE_PATHS.PROFILE,
      icon: User,
      label: 'Hồ sơ',
    },
    {
      to: ROUTE_PATHS.SETTINGS,
      icon: Settings,
      label: 'Cài đặt',
    },
  ];

  return (
    <nav className="left-navigation" aria-label="Thanh điều hướng chính">
      <div className="nav-group nav-top">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              title={item.label}
              aria-label={item.label}
            >
              <div className="nav-icon-wrapper">
                <Icon size={22} className="nav-icon" />
                {item.badge !== null && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </div>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="nav-group nav-bottom">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              title={item.label}
              aria-label={item.label}
            >
              <div className="nav-icon-wrapper">
                <Icon size={22} className="nav-icon" />
              </div>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          );
        })}

        <NavLink
          to={ROUTE_PATHS.LOGIN}
          className="nav-item nav-item-logout"
          title="Đăng xuất"
          aria-label="Đăng xuất"
        >
          <div className="nav-icon-wrapper">
            <LogOut size={22} className="nav-icon" />
          </div>
          <span className="nav-label">Đăng xuất</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
