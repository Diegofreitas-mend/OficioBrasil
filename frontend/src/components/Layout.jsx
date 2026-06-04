import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import styles from '../styles/components/Layout.module.css';

export default function Layout() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();

  // Fecha o drawer ao trocar de rota (mobile)
  useEffect(() => { setNavOpen(false); }, [pathname]);

  return (
    <div className={styles.layout}>
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className={styles.main}>
        <Header onMenu={() => setNavOpen(true)} />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
