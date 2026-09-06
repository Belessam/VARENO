/**
 * VARENO StepIndicator Component
 *
 * Numbered step headers used in the order form.
 * Square gold number + uppercase label.
 */

interface StepIndicatorProps {
  number: number;
  label: string;
  className?: string;
}

export function StepIndicator({
  number,
  label,
  className = "",
}: StepIndicatorProps) {
  return (
    <div className={`flex items-center gap-3 mb-4 ${className}`}>
      <span className="w-6 h-6 bg-primary text-on-primary font-body text-label-md flex items-center justify-center font-bold">
        {number}
      </span>
      <h3 className="font-display text-headline-sm text-on-surface uppercase tracking-[0.01em]">
        {label}
      </h3>
    </div>
  );
}
