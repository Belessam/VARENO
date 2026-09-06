/**
 * VARENO Logo Component
 *
 * Text-based brand mark.
 *
 * Usage:
 *   <Logo />                    → compact logo (header/footer)
 *   <Logo variant="compact" />  → small header logo
 *   <Logo variant="full" />     → full logo with tagline
 *   <Logo variant="mark" />     → text only
 */

interface LogoProps {
  variant?: "compact" | "full" | "mark";
  className?: string;
}

export function Logo({ variant = "compact", className = "" }: LogoProps) {
  if (variant === "mark") {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        aria-label="VARENO"
      >
        <span className="font-display text-lg uppercase tracking-[0.15em] text-primary font-semibold">
          VARENO
        </span>
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <span className="font-display text-xl uppercase tracking-[0.15em] text-primary font-semibold">
          VARENO
        </span>
        <span className="font-body text-label-sm uppercase tracking-[0.22em] text-primary-variant mt-1">
          SMOKE SMARTER.
        </span>
      </div>
    );
  }

  // compact — default for header/footer
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-display text-lg uppercase tracking-[0.15em] text-primary font-semibold">
        VARENO
      </span>
      <span className="hidden sm:block font-body text-label-sm uppercase tracking-[0.22em] text-primary-variant mt-0.5">
        SMOKE SMARTER.
      </span>
    </div>
  );
}
