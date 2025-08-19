import type { ReactNode } from "react";
import styles from "../ui/CTAButonn.module.css";

interface CTAButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary"; 
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit";
}

export default function CTAButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
}: CTAButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.btn} ${styles[variant]} ${styles[size]}`}
    >
      {children}
    </button>
  );
}
