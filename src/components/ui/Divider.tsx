import { type HTMLAttributes, forwardRef } from "react";

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  variant?: "default" | "gold" | "gradient";
}

const variantClassMap: Record<"default" | "gold" | "gradient", string> = {
  default: "border-outline-variant/30",
  gold: "border-primary/30",
  gradient:
    "border-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent",
};

export const Divider = forwardRef<HTMLHRElement, DividerProps>(
  ({ variant = "default", className = "", ...props }, ref) => {
    if (variant === "gradient") {
      return (
        <hr
          ref={ref}
          className={`${variantClassMap[variant]} ${className}`}
          {...props}
        />
      );
    }

    return (
      <hr
        ref={ref}
        className={`border-t ${variantClassMap[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Divider.displayName = "Divider";
