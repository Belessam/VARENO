/**
 * VARENO Badge Component
 *
 * Small rectangular chips used for labels, tags, and status indicators.
 * Sharp corners, uppercase tracking, gold accents.
 */

import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "primary" | "gold-outline";
  className?: string;
}

const variantStyles: Record<string, string> = {
  default:
    "bg-surface-container-high text-on-surface-variant border border-outline-variant/30",
  primary: "bg-primary text-on-primary",
  "gold-outline":
    "bg-transparent text-primary border border-primary/40",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 px-3 py-1",
        "font-body text-label-sm uppercase tracking-[0.18em]",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
