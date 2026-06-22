import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const menuItems = [
  {
    path: "/",
    end: true,
    label: "Dashboard",
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.8" fill="none"/>
      </svg>
    ),
  },
  {
    path: "/products",
    label: "Товары",
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    path: "/categories",
    label: "Категории",
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6h16M4 10h16M4 14h10M4 18h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    path: "/suppliers",
    label: "Поставщики",
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2M5 21H3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-4h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  {
    path: "/stock-operations",
    label: "Операции склада",
    icon: (
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <div className={styles.logoTitle}>PharmaStock</div>
        <div className={styles.logoSub}>Управление складом</div>
      </div>

      <nav className={styles.nav} aria-label="Основная навигация">
        <div className={styles.navLabel}>Меню</div>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              isActive ? `${styles.link} ${styles.active}` : styles.link
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
