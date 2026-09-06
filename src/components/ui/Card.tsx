import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "inset";
}

const variantStyles: Record<"default" | "elevated" | "inset", string> = {
  default: "bg-surface-container border border-outline-variant/20",
  elevated:
    "bg-surface-container-high border border-outline-variant/20 shadow-xl",
  inset: "bg-surface-container-lowest border border-outline-variant/10",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
