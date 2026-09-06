import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        <label
          htmlFor={inputId}
          className="block font-body text-label-sm uppercase tracking-[0.18em] text-on-surface-variant"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full bg-surface-container-lowest text-on-surface",
            "px-4 py-3 font-body text-body-md",
            "placeholder:text-outline/60",
            "focus:outline-none focus:ring-1 focus:ring-primary",
            "shadow-inner border border-outline-variant/30",
            error ? "border-error" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />
        {error && (
          <p className="font-body text-body-sm text-error mt-1">{error}</p>
        )}
        {!error && helperText && (
          <p className="font-body text-body-sm text-on-surface-variant/60 mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
