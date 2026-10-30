import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import Navigation from '../components/layout/Navigation';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navigation />
      <Sidebar />
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
