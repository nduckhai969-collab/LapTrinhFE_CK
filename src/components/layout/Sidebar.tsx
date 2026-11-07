import {Bell, ChevronLeft, ChevronRight, LogOut, MessageCircle, Settings, Users} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';

export interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    activeTab?: string;
}

interface SidebarItem {
    id: string;
    name: string;
    icon: LucideIcon;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
    {id: 'chat', name: 'Tin nhắn', icon: MessageCircle},
    {id: 'contacts', name: 'Danh bạ', icon: Users},
    {id: 'notifications', name: 'Thông báo', icon: Bell},
];

const SIDEBAR_BOTTOM_ITEMS: SidebarItem[] = [
    {id: 'settings', name: 'Cài đặt', icon: Settings},
    {id: 'logout', name: 'Đăng xuất', icon: LogOut},
];

const renderSidebarItem = (item: SidebarItem, activeTab?: string) => {
    return (
        <button
            type="button"
            key={item.id}
            className={item.id === activeTab ? 'menu-button active' : 'menu-button'}
            title={item.name}
        >
            <item.icon size={20}/>
            <span className="menu-text">{item.name}</span>
        </button>
    );
};

const Sidebar = ({isOpen, onClose, activeTab}: SidebarProps) => {
    return (
        <aside className={isOpen ? 'sidebar' : 'sidebar collapsed'}>
            <button type="button" className="toggle-button" onClick={onClose} title="Thu gọn / mở rộng">
                {isOpen ? <ChevronLeft size={20}/> : <ChevronRight size={20}/>}
            </button>

            <nav className="menu">
                {SIDEBAR_ITEMS.map((item) => renderSidebarItem(item, activeTab))}
            </nav>

            {SIDEBAR_BOTTOM_ITEMS.map((item) => renderSidebarItem(item, activeTab))}
        </aside>
    );
};

export default Sidebar;
