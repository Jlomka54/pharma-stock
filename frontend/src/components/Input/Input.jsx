import React from "react";
import styles from "./Input.module.css";

export default function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
  ...rest
}) {
  const id = name || undefined;

  return (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required={required}
        className={styles.input}
        {...rest}
      />
    </div>
  );
}
