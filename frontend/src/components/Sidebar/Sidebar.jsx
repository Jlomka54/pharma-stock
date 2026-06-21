import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const menuItems = [
  { path: "/", label: "Dashboard", end: true },
  { path: "/products", label: "Товары" },
  { path: "/categories", label: "Категории" },
  { path: "/suppliers", label: "Поставщики" },
  { path: "/stock-operations", label: "Складские операции" },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav} aria-label="Основная навигация">
        <NavLink
          key={0}
          to={menuItems[0].path}
          end={menuItems[0].end}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          {menuItems[0].label}
        </NavLink>
        <NavLink
          key={1}
          to={menuItems[1].path}
          end={menuItems[1].end}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          {menuItems[1].label}
        </NavLink>
        <NavLink
          key={2}
          to={menuItems[2].path}
          end={menuItems[2].end}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          {menuItems[2].label}
        </NavLink>
        <NavLink
          key={3}
          to={menuItems[3].path}
          end={menuItems[3].end}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          {menuItems[3].label}
        </NavLink>
        <NavLink
          key={4}
          to={menuItems[4].path}
          end={menuItems[4].end}
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          {menuItems[4].label}
        </NavLink>
      </nav>
    </aside>
  );
}
