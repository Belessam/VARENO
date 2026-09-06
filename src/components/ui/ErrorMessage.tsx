/**
 * ErrorMessage Component
 *
 * Consistent error display with icon and optional retry action.
 */

import type { ReactNode } from "react";
import { Icon } from "./Icon";
import { Button } from "./Button";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  children?: ReactNode;
}

export function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
  children,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-2xl px-gutter-mobile text-center">
      <Icon name="error_outline" size="xl" className="text-error mb-4" />
      <h2 className="font-display text-headline-md text-on-surface mb-2">
        {title}
      </h2>
      <p className="font-body text-body-md text-on-surface-variant max-w-md mb-6">
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          TRY AGAIN
        </Button>
      )}
      {children}
    </div>
  );
}
