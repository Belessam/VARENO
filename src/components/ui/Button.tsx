import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-container text-on-primary hover:bg-primary transition-all duration-300 shadow-xl",
  secondary:
    "border border-primary bg-transparent text-on-surface hover:bg-secondary-container/35 transition-all duration-200",
  ghost:
    "bg-transparent text-on-surface-variant hover:text-primary transition-colors duration-200",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2",
  md: "px-6 sm:px-8 py-4",
  lg: "px-8 sm:px-10 py-5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={[
          "inline-flex items-center justify-center uppercase font-body font-semibold",
          "tracking-[0.15em] text-label-md",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? "w-full" : "",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
