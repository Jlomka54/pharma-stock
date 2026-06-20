import React from "react";
import styles from "./Loader.module.css";

export default function Loader({ text = "Загрузка..." }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} aria-hidden="true" />
      <div className={styles.text}>{text}</div>
    </div>
  );
}
