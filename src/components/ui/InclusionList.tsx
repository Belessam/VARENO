/**
 * VARENO InclusionList Component
 *
 * Checklist of items included with the order.
 * Gold checkmark icons + item text.
 */

import { Icon } from "./Icon";

interface InclusionListProps {
  items: readonly string[];
  className?: string;
}

export function InclusionList({ items, className = "" }: InclusionListProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <div
          key={item}
          className="flex items-center gap-2.5 font-body text-body-sm text-on-surface-variant"
        >
          <Icon
            name="check_circle"
            size="md"
            className="text-primary shrink-0"
            filled
          />
          <span>{item}</span>
        </div>
      ))}
    </div>
  );
}
