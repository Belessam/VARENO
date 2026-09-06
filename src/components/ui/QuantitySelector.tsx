/**
 * VARENO QuantitySelector Component
 *
 * Machined plus/minus triggers with razor-sharp vertical hairline dividers.
 * Min/max bounds enforced.
 */

import { clamp } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/config/app";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantitySelector({
  value,
  onChange,
  min = APP_CONFIG.minQuantity,
  max = APP_CONFIG.maxQuantity,
  className = "",
}: QuantitySelectorProps) {
  const decrease = () => {
    const next = clamp(value - 1, min, max);
    if (next !== value) onChange(next);
  };

  const increase = () => {
    const next = clamp(value + 1, min, max);
    if (next !== value) onChange(next);
  };

  return (
    <div
      className={`flex items-center bg-surface-container space-x-1 p-1 ${className}`}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors text-lg disabled:opacity-30 disabled:cursor-not-allowed"
      >
        −
      </button>
      <span className="w-8 text-center font-body text-label-md text-on-surface font-semibold">
        {value}
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors text-lg disabled:opacity-30 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
}
