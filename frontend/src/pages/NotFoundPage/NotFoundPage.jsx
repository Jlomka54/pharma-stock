import React from "react";
import { Link } from "react-router-dom";
import styles from "./NotFoundPage.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.code}>404</div>
      <h2 className={styles.title}>Страница не найдена</h2>
      <p className={styles.text}>Запрашиваемая страница не существует или была перемещена.</p>
      <Link to="/" className={styles.link}>← Вернуться на Dashboard</Link>
    </div>
  );
}
