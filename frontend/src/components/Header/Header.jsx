import React from "react";
import styles from "./Header.module.css";

export default function Header() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("ru-RU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <div className={styles.date}>{dateStr}</div>
      </div>
      <div className={styles.right}>
        <div className={styles.badge}>
          <span className={styles.dot} />
          Система активна
        </div>
      </div>
    </header>
  );
}
