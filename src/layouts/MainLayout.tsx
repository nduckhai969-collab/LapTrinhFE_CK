import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Navigation from '../components/layout/Navigation';

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="main-layout">
            <Navigation/>
            <Header/>
            <div className="main-body">
                <Sidebar isOpen={isSidebarOpen} onClose={handleToggleSidebar} activeTab="chat"/>
                <main className="main-content">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
