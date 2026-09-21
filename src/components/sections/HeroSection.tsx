/**
 * Hero Section
 *
 * Split 12-column grid: editorial text left, product showcase right.
 * On mobile: product appears first, then text.
 * Ambient radial gold glow, micro spec strip, dual CTAs.
 */

import { Link } from "react-router-dom";
import { PRODUCT } from "@/lib/config/product";
import { Icon } from "@/components/ui/Icon";
import { ProductImageGallery } from "@/components/ui/ProductImageGallery";
import { useLanguage } from "@/lib/i18n";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden">
      {/* Ambient Lounge Radial Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(200,164,106,0.12),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-gutter-mobile lg:px-gutter-desktop py-xl lg:py-4xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Product Showcase — first on mobile, second on desktop */}
          <div className="lg:col-span-6 relative order-1 lg:order-2">
            <ProductImageGallery />
          </div>

          {/* Editorial Spec Column — second on mobile, first on desktop */}
          <div className="lg:col-span-6 flex flex-col items-start space-y-5 order-2 lg:order-1">
            {/* Headline */}
            <div className="space-y-3">
              <h1 className="font-display text-display-xl-mobile lg:text-display-xl text-on-surface uppercase tracking-[0.02em]">
                {t("hero.headline1")}
                <br />
                <span className="text-primary italic font-normal">
                  {t("hero.headline2")}
                </span>
              </h1>
              <p className="font-body text-body-md lg:text-body-lg text-on-surface-variant max-w-lg leading-relaxed">
                {t("hero.description")}
              </p>
            </div>

            {/* Price & Badge */}
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 pt-1">
              <span className="font-body text-headline-lg lg:text-headline-xl font-light text-primary tracking-wide">
                {PRODUCT.priceDisplay} {PRODUCT.currencyDisplay}
              </span>
              <span className="font-body text-label-sm uppercase tracking-[0.18em] text-on-surface-variant/80 bg-surface-container-low px-3 py-1.5 hidden sm:inline">
                {t("hero.freeDispatch")}
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 pt-2 w-full sm:w-auto">
              <Link
                to="/order"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-container text-on-primary font-body text-label-md uppercase tracking-[0.15em] hover:bg-primary transition-all duration-300 shadow-xl"
              >
                {t("hero.getVareno")}
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 font-body text-label-md uppercase tracking-[0.15em] text-on-surface-variant hover:text-primary transition-colors py-2 group"
              >
                <span>{t("hero.howItWorks")}</span>
                <Icon
                  name="arrow_forward"
                  size="sm"
                  className="group-hover:translate-x-1 transition-transform"
                />
              </a>
            </div>

            {/* Micro Spec Strip */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 w-full max-w-md">
              {[
                { label: t("hero.specTimber"), value: PRODUCT.specs.timber },
                { label: t("hero.specAlloy"), value: PRODUCT.specs.alloy },
                { label: t("hero.specAsh"), value: PRODUCT.specs.ashRetention },
              ].map((spec) => (
                <div key={spec.label}>
                  <span className="block font-body text-label-sm text-primary uppercase tracking-[0.18em]">
                    {spec.label}
                  </span>
                  <span className="block font-body text-body-sm text-on-surface-variant mt-1">
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
