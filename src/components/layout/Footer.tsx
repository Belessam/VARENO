import { Link } from "react-router-dom";
import { Logo } from "@/components/brand";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-xl">
      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/">
          <Logo variant="compact" />
        </Link>

        <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-2 md:gap-x-8">
          <Link
            to="/terms"
            className="font-body text-label-sm uppercase text-on-surface-variant hover:text-primary transition-colors tracking-[0.18em]"
          >
            Terms &amp; Privacy
          </Link>
          <Link
            to="/contact"
            className="font-body text-label-sm uppercase text-on-surface-variant hover:text-primary transition-colors tracking-[0.18em]"
          >
            Atelier Contact
          </Link>
        </div>

        <div className="font-body text-label-sm uppercase text-on-surface-variant/70 tracking-[0.18em] text-center">
          &copy; {new Date().getFullYear()} VARENO Atelier. All Rights
          Reserved.
        </div>
      </div>
    </footer>
  );
}
