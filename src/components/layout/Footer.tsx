import { Link } from "react-router-dom";
import { Logo } from "@/components/brand";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/30 py-xl lg:py-2xl mt-20 lg:mt-32">
      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-gutter-desktop flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/">
          <Logo variant="compact" />
        </Link>

        <div className="flex items-center flex-wrap justify-center gap-x-4 gap-y-2 md:gap-x-8">
          <Link
            to="/terms"
            className="font-body text-label-sm uppercase text-on-surface-variant hover:text-primary transition-colors tracking-[0.18em]"
          >
            {t("nav.terms")}
          </Link>
          <Link
            to="/contact"
            className="font-body text-label-sm uppercase text-on-surface-variant hover:text-primary transition-colors tracking-[0.18em]"
          >
            {t("nav.contact")}
          </Link>
        </div>

        <div className="font-body text-label-sm uppercase text-on-surface-variant/70 tracking-[0.18em] text-center">
          &copy; {new Date().getFullYear()} VARENO Atelier. {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
