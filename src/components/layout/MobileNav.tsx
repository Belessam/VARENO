/**
 * VARENO MobileNav Component
 *
 * Slide-out mobile navigation drawer.
 * Placeholder for Phase 9 refinement.
 */

import { Link } from "react-router-dom";
import { Icon } from "../ui/Icon";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav className="fixed top-0 right-0 w-72 h-full bg-surface-container-low z-50 md:hidden flex flex-col shadow-2xl">
        {/* Close button */}
        <div className="flex items-center justify-end p-4">
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <Icon name="close" size="lg" />
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-1 px-4">
          <Link
            to="/"
            onClick={onClose}
            className="py-3 px-4 font-body text-label-md uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
          >
            Home
          </Link>
          <Link
            to="/#how-it-works"
            onClick={onClose}
            className="py-3 px-4 font-body text-label-md uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
          >
            How It Works
          </Link>
          <Link
            to="/#our-story"
            onClick={onClose}
            className="py-3 px-4 font-body text-label-md uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors"
          >
            Our Story
          </Link>
        </div>

        {/* CTA */}
        <div className="mt-auto p-4 border-t border-outline-variant/20">
          <Link
            to="/order"
            onClick={onClose}
            className="flex items-center justify-center w-full py-4 bg-primary-container text-on-primary font-body text-label-md uppercase tracking-[0.15em] hover:bg-primary transition-all duration-300"
          >
            Get VARENO
          </Link>
        </div>
      </nav>
    </>
  );
}
