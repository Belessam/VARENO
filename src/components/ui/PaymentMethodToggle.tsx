/**
 * VARENO PaymentMethodToggle Component
 *
 * Two interactive option tabs for COD vs InstaPay selection.
 * Gold left indicator bar on active tab, tonal stepping.
 */

import type { PaymentMethod } from "@/lib/config/app";
import { APP_CONFIG } from "@/lib/config/app";
import { Icon } from "./Icon";

interface PaymentMethodToggleProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  className?: string;
}

const methods = Object.values(APP_CONFIG.paymentMethods);

const iconMap: Record<PaymentMethod, string> = {
  cod: "payments",
  instapay: "account_balance_wallet",
};

export function PaymentMethodToggle({
  value,
  onChange,
  className = "",
}: PaymentMethodToggleProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
      {methods.map((method) => {
        const isActive = value === method.id;
        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onChange(method.id)}
            className={[
              "p-4 text-left transition-all duration-200 relative overflow-hidden",
              isActive
                ? "bg-surface-container-high"
                : "bg-surface-container-lowest opacity-70 hover:opacity-100",
            ].join(" ")}
          >
            {/* Active indicator bar */}
            <div
              className={[
                "absolute top-0 left-0 w-1 h-full transition-colors duration-200",
                isActive ? "bg-primary" : "bg-transparent",
              ].join(" ")}
            />

            <div className="flex items-center justify-between mb-1">
              <span
                className={[
                  "font-body text-label-md tracking-[0.15em] uppercase font-semibold",
                  isActive ? "text-primary" : "text-on-surface",
                ].join(" ")}
              >
                {method.label}
              </span>
              <Icon
                name={iconMap[method.id]}
                size="md"
                className={isActive ? "text-primary" : "text-on-surface-variant"}
                filled={isActive}
              />
            </div>
            <p className="font-body text-body-sm text-on-surface-variant leading-tight">
              {method.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
