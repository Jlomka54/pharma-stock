import React from "react";
import styles from "./ErrorMessage.module.css";

export default function ErrorMessage({ message = "Произошла ошибка" }) {
  return <div className={styles.error}>{message}</div>;
}
