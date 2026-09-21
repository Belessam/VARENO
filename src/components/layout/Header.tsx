import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/brand";
import { MobileNav } from "./MobileNav";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n";

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <header className="w-full bg-surface-container-lowest border-b border-outline-variant/20">
        <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-gutter-desktop flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Logo variant="compact" />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="font-body text-label-sm uppercase tracking-[0.18em] text-on-surface-variant hover:text-primary transition-colors"
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/#how-it-works"
              className="font-body text-label-sm uppercase tracking-[0.18em] text-on-surface-variant hover:text-primary transition-colors"
            >
              {t("nav.howItWorks")}
            </Link>
            <Link
              to="/#our-story"
              className="font-body text-label-sm uppercase tracking-[0.18em] text-on-surface-variant hover:text-primary transition-colors"
            >
              {t("nav.ourStory")}
            </Link>
            <LanguageSwitcher />
            <Link
              to="/order"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-primary-container text-on-primary font-body text-label-md uppercase tracking-[0.15em] hover:bg-primary transition-all duration-300"
            >
              {t("nav.getVareno")}
            </Link>
          </nav>

          <div className="flex md:hidden items-center gap-3">
            <LanguageSwitcher />
            <button
              className="text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Open menu"
              onClick={() => setMobileNavOpen(true)}
            >
              <span className="material-symbols-outlined text-[24px]">menu</span>
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
    </>
  );
}
