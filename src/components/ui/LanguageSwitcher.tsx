/**
 * LanguageSwitcher
 *
 * Toggle between English and Arabic.
 * Shows the name of the OTHER language to switch to.
 */

import { useLanguage } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const targetLocale = locale === "en" ? "ar" : "en";
  const label = locale === "en" ? "العربية" : "English";

  return (
    <button
      type="button"
      onClick={() => setLocale(targetLocale)}
      className="font-body text-label-sm uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary transition-colors px-2 py-1 border border-outline-variant/30 hover:border-primary/50 cursor-pointer"
      aria-label={`Switch to ${locale === "en" ? "Arabic" : "English"}`}
    >
      {label}
    </button>
  );
}
