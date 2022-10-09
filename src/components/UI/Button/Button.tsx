import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import styles from "./Button.module.css";

export enum ButtonVariants {
  default = "default",
  primary = "primary",
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariants;
  className?: string;
  children: ReactNode;
}

const Button: FC<ButtonProps> = ({
  variant = ButtonVariants.default,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={[styles.button, styles[variant], className].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
