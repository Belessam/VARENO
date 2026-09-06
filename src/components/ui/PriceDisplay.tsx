/**
 * VARENO PriceDisplay Component
 *
 * Consistent price rendering with currency label.
 */

import { formatPriceEGP } from "@/lib/config/product";
import { PRODUCT } from "@/lib/config/product";

interface PriceDisplayProps {
  /** Price in piastres */
  piastres: number;
  size?: "sm" | "md" | "lg" | "xl";
  showCurrency?: boolean;
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "text-headline-sm",
  md: "text-headline-md",
  lg: "text-headline-lg",
  xl: "text-headline-lg lg:text-headline-lg",
};

export function PriceDisplay({
  piastres,
  size = "md",
  showCurrency = true,
  className = "",
}: PriceDisplayProps) {
  return (
    <span className={`font-display ${sizeClasses[size]} text-primary ${className}`}>
      {formatPriceEGP(piastres)}
      {showCurrency && (
        <span className="font-body text-label-sm text-on-surface-variant ml-1">
          {PRODUCT.currencyDisplay}
        </span>
      )}
    </span>
  );
}
