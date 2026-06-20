import React from "react";
import styles from "./Button.module.css";

export default function Button({
  children,
  type = "button",
  onClick,
  variant = "primary",
  disabled = false,
  ...rest
}) {
  const variantClass = styles[variant] || "";
  const disabledClass = disabled ? styles.disabled : "";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${variantClass} ${disabledClass}`.trim()}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
