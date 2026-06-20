import React from "react";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>PharmaStock</h1>
        <p className={styles.subtitle}>Склад медицинских товаров в аптеке</p>
      </div>
    </header>
  );
}
