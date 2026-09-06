import { type HTMLAttributes, forwardRef } from "react";

interface IconProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  filled?: boolean;
}

const sizeMap: Record<"sm" | "md" | "lg" | "xl", string> = {
  sm: "text-[16px]",
  md: "text-[20px]",
  lg: "text-[24px]",
  xl: "text-[28px]",
};

export const Icon = forwardRef<HTMLSpanElement, IconProps>(
  ({ name, size = "md", filled = false, className = "", ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={[
          "material-symbols-outlined",
          sizeMap[size],
          filled ? "[font-variation-settings:'FILL'_1]" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {name}
      </span>
    );
  }
);

Icon.displayName = "Icon";
