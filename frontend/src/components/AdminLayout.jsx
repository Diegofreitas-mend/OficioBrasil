import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar.jsx';
import AdminHeader from './AdminHeader.jsx';
import styles from '../styles/components/AdminLayout.module.css';

export default function AdminLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();

  // Fecha o drawer ao trocar de rota (mobile)
  useEffect(() => { setNavOpen(false); }, [pathname]);

  return (
    <div className={styles.layout}>
      <AdminSidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className={styles.main}>
        <AdminHeader onMenu={() => setNavOpen(true)} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
