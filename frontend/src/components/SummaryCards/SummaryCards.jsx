import React from "react";
import styles from "./SummaryCards.module.css";

export default function SummaryCards({ cards = [] }) {
  if (!cards || cards.length === 0) return null;

  return (
    <div className={styles.grid}>
      {cards.map((c, idx) => (
        <div key={idx} className={styles.card}>
          {c.icon && <span className={styles.icon}>{c.icon}</span>}
          <div className={styles.title}>{c.title}</div>
          <div className={styles.value}>{c.value}</div>
          {c.description && <div className={styles.desc}>{c.description}</div>}
        </div>
      ))}
    </div>
  );
}
