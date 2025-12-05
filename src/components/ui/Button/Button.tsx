import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "text";
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = "primary",
  fullWidth = true,
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const variantClass = styles[`button--${variant}`] || "";

  return (
    <button
      className={`${styles.button} ${variantClass} ${className}`}
      disabled={disabled || isLoading}
      style={{ width: fullWidth ? "100%" : "auto" }}
      {...props}
    >
      {isLoading ? "Загрузка..." : children}
    </button>
  );
};
