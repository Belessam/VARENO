/**
 * VARENO Section Component
 *
 * Consistent section wrapper with proper padding, max-width, and background.
 * Maps to the design system's spacing rhythm.
 */

import type { HTMLAttributes, ReactNode } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  variant?: "default" | "surface" | "surface-low" | "surface-high";
  spacing?: "sm" | "md" | "lg" | "xl";
}

const variantStyles: Record<string, string> = {
  default: "bg-surface-container-lowest",
  surface: "bg-surface-container",
  "surface-low": "bg-surface-container-low",
  "surface-high": "bg-surface-container-high",
};

const spacingStyles: Record<string, string> = {
  sm: "py-xl",
  md: "py-2xl lg:py-3xl",
  lg: "py-2xl lg:py-4xl",
  xl: "py-3xl lg:py-4xl",
};

export function Section({
  children,
  variant = "default",
  spacing = "lg",
  className = "",
  ...props
}: SectionProps) {
  return (
    <section
      className={`w-full ${variantStyles[variant]} ${spacingStyles[spacing]} ${className}`}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-gutter-desktop">
        {children}
      </div>
    </section>
  );
}

/**
 * SectionHeader — eyebrow + headline + optional description
 * Used consistently across homepage sections.
 */
interface SectionHeaderProps {
  eyebrow?: string;
  headline: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  headline,
  description,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center items-center" : "";

  return (
    <div className={`flex flex-col ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="font-body text-label-sm uppercase tracking-[0.22em] text-primary block mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-headline-lg lg:text-headline-lg uppercase tracking-[0.03em] text-on-surface">
        {headline}
      </h2>
      {description && (
        <p className="font-body text-body-md text-on-surface-variant mt-3 max-w-lg">
          {description}
        </p>
      )}
    </div>
  );
}
